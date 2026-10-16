# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Pluck is a macOS-only (Apple silicon, macOS 13+) menu bar Electron app: a global shortcut lets the user select a screen area, and the text in it is copied to the clipboard via on-device Apple Vision OCR. It runs as an `LSUIElement` (no Dock icon) and stays alive with no windows open.

## Commands

Uses Bun. Building requires Xcode (`swiftc`) because the OCR helper is a Swift binary.

- `bun run dev` — compile the Swift helper, then start Vite + Electron with hot reload. The helper is compiled only once at startup; after editing `native/recognize-image.swift`, run `bun run build:recognize-image` (or restart dev).
- `bun run build` — clean `dist`/`dist-electron`, compile the Swift helper, build renderer, main and preload
- `bun run start` — run the built app (`electron .`)
- `bun run lint` — Oxlint (correctness = error, suspicious = warn)
- `bun run format` — Prettier (single quotes, 100 cols, `arrowParens: avoid`, one JSX attribute per line)
- `bun run typecheck` — TypeScript check (`tsconfig` is `noEmit`)
- `bun run dist` — signed + notarized `.dmg` in `release/`. Needs a Developer ID cert in the keychain and a `notarytool` keychain profile (default name `notary`, shared with Swatch; override with `APPLE_KEYCHAIN_PROFILE`). `scripts/notarize-dmg.sh` signs/notarizes/staples the DMG after electron-builder. The app icon is an Icon Composer file (`build/Pluck.icon`), so packaging needs Xcode 26+.

There is no test suite.

## Architecture

Three code areas under `src/`, built by `vite-plugin-electron` (see `vite.config.ts`):

- `src/main/` — Electron main process (ESM, entry `main.ts` → `dist-electron/main.js`)
- `src/preload.ts` — built as `dist-electron/preload.cjs` (CommonJS; the `.cjs` name is forced in `vite.config.ts` and referenced by `PRELOAD_PATH`)
- `src/renderer/` — React 19 + Tailwind v4 UI, a single `index.html` that renders a page chosen by the `?page=` query param (`settings` | `update`, typed as `RendererPage` in `src/shared/ipc.ts`). `windows/load-renderer.ts` loads it from the Vite dev server in dev or from `dist/` in production.
- `src/shared/` — types and the IPC contract shared by main, preload and renderer

### Main process layers

- `lib/` — pure helpers with no Electron or system access (`join-lines`, `validate-shortcut`, `log`)
- `system/` — wrappers over macOS and the file system (`capture-screen`, `clipboard-image`, `recognize-image`, `play-sound`, `screen-recording`, `launch-at-login`, `json-file`). No UI.
- `dialogs/` — native message boxes and the about panel. `show-message.ts` (`showMessage`, `confirm`) focuses the app first, since it has no Dock icon.
- `tray/`, `windows/` — the tray menu and BrowserWindows
- `settings/` — the settings store and its validation only (data layer, imports nothing above `lib/` and `system/`)
- Top level: `pluck.ts` (the capture features: screen selection and clipboard image), `shortcut.ts`, `updater.ts`, `ipc.ts`, `settings-handlers.ts` (settings-window IPC handlers), `main.ts`

Error rule: expected outcomes (cancelled selection, missing settings file) return `null` silently; unexpected failures go through `logError` from `lib/log.ts`.

### Capture pipeline (`src/main/pluck.ts`)

Two entry points share one re-entry guard (`withPluckGuard`) and one tail (`copyRecognizedText`: recognize → delete the temp image → write to clipboard → play sound):

- `pluckText` — triggered by the global shortcut or the tray menu item. Steps: check Screen Recording permission (if missing, confirm via `dialogs/screen-recording-dialog.ts` and open System Settings instead of capturing) → `/usr/sbin/screencapture -i -x` to a temp PNG → run the `recognize-image` Swift binary on it → delete the PNG → write to clipboard → play success/failure sound.
- `pluckClipboardImage` — tray item "Pluck from Clipboard Image", no Screen Recording needed. `system/clipboard-image.ts` saves the clipboard to a temp file: a file copied in Finder (`text/uri-list`) is copied as is if it has an image extension, otherwise `image/png` is written (Electron converts TIFF-only clipboards to it). A Finder copy of a non-image file returns `null` instead of falling back to the image, because that image is the file's icon. No image shows `dialogs/clipboard-image-dialog.ts`.

Electron 44's `clipboard` is the async W3C-style API (`read()` → `ClipboardItem[]`, `writeText()` returns a promise); `readImage`/`readText` sync methods no longer exist.

The binary runs text recognition and barcode detection in one Vision pass and prints JSON `{ kind: 'text' | 'barcode', text }`. If any barcode/QR code has a string payload, it wins over the text (multiple codes are deduped and joined top-to-bottom). Barcode payloads are copied verbatim; text is joined into one line unless `keepLineBreaks` is set.

The Swift helper (`native/recognize-image.swift`) is compiled to `dist-electron/recognize-image`, located next to `main.js` via `import.meta.dirname`, and unpacked from the asar in packaged builds (`asarUnpack` in `electron-builder.json`; the path is rewritten `app.asar` → `app.asar.unpacked`). If you rename or move it, update all three places.

### Settings

- `settings/store.ts` — in-memory cache over `userData/settings.json`, with a change-listener API (`onSettingsChange`); the tray rebuilds its menu when the shortcut changes.
- `settings/parse-settings.ts` — validates whatever is on disk and falls back to `DEFAULT_SETTINGS` per field. Add new persisted settings here and to `StoredSettings` in `src/shared/settings.ts`.
- `launchAtLogin` is not stored; `system/launch-at-login.ts` reads and writes the macOS login item, and it's merged into `AppSettings` at IPC time.

### IPC

`src/shared/ipc.ts` is the single source of truth: `IpcInvokeContract` maps each request channel to its argument tuple and result, `IpcEventContract` maps each main → renderer event to its payload. Everything else is typed from it:

- main: `handle(channel, handler)` and `send(webContents, channel, ...args)` in `src/main/ipc.ts`. Handlers receive `unknown` arguments and must narrow them with `assertBoolean` / `assertString`; their return type is checked against the contract.
- preload: `invoke(channel, ...args)` and `on(channel, listener)` in `src/preload.ts`
- renderer: `window.settings` / `window.updater` types come from the preload objects (`SettingsApi`, `UpdaterApi`) via `src/renderer/global.d.ts`

To add a call: add it to the contract, `handle` it in main, expose it in preload. A mismatch anywhere is a type error.

In the renderer, toggles use `hooks/use-synced-setting.ts`: optimistic update, then the value confirmed by main, reverting on failure.

Shortcut recording in the settings window calls `pauseShortcut` so the global shortcut doesn't fire while the user presses keys; it's re-registered on `resumeShortcut` or when the sender's webContents is destroyed.

### Updates

`updater.ts` holds the update flow and uses `electron-updater` against GitHub Releases (`publish` in `electron-builder.json`) with `autoDownload` off; all prompts live in `dialogs/update-dialogs.ts`. It's imported lazily from the tray menu, so `electron-updater` stays out of `main.js`. Download progress goes to the `update` renderer page over `updater:progress`.

### Renderer CSP

A Content Security Policy meta tag is injected only in production builds (a custom plugin in `vite.config.ts`). Inline scripts and remote resources will be blocked in the built app even if they work in dev.
