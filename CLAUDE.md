# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Pluck is a macOS-only (Apple silicon, macOS 13+) menu bar Electron app: a global shortcut lets the user select a screen area, and the text in it is copied to the clipboard via on-device Apple Vision OCR. It runs as an `LSUIElement` (no Dock icon) and stays alive with no windows open.

## Commands

Uses Bun. Building requires Xcode (`swiftc`) because the OCR helper is a Swift binary.

- `bun run dev` — compile the Swift helper, then start Vite + Electron with hot reload
- `bun run build` — clean `dist`/`dist-electron`, compile the Swift helper, build renderer, main and preload
- `bun run start` — run the built app (`electron .`)
- `bun run lint` — Oxlint (correctness = error, suspicious = warn)
- `bun run format` — Prettier (single quotes, 100 cols, `arrowParens: avoid`, one JSX attribute per line)
- `bun run typecheck` — TypeScript check (`tsconfig` is `noEmit`)
- `bun run dist` — signed + notarized `.dmg` in `release/`. Needs a Developer ID cert in the keychain and a `notarytool` keychain profile (default name `notary`, shared with Swatch; override with `APPLE_KEYCHAIN_PROFILE`). `scripts/notarize-dmg.sh` signs/notarizes/staples the DMG after electron-builder.

There is no test suite.

## Architecture

Three code areas under `src/`, built by `vite-plugin-electron` (see `vite.config.ts`):

- `src/main/` — Electron main process (ESM, entry `main.ts` → `dist-electron/main.js`)
- `src/preload.ts` — built as `dist-electron/preload.cjs` (CommonJS; the `.cjs` name is forced in `vite.config.ts` and referenced by `PRELOAD_PATH`)
- `src/renderer/` — React 19 + Tailwind v4 UI, a single `index.html` that renders a page chosen by the `?page=` query param (`settings` | `update`, typed as `RendererPage` in `src/shared/ipc.ts`). `windows/load-renderer.ts` loads it from the Vite dev server in dev or from `dist/` in production.
- `src/shared/` — types and IPC channel names shared by main, preload and renderer

### Capture pipeline (`src/main/pluck-text.ts`)

Triggered by the global shortcut or the tray menu item. Guarded against re-entry. Steps: check Screen Recording permission (if missing, show a dialog and open System Settings instead of capturing) → `/usr/sbin/screencapture -i -x` to a temp PNG → run the `recognize-text` Swift binary on it (prints recognized lines to stdout) → delete the PNG → write to clipboard, joining lines unless `keepLineBreaks` is set → play success/failure sound.

The Swift helper (`native/recognize-text.swift`) is compiled to `dist-electron/recognize-text`, located next to `main.js` via `import.meta.dirname`, and unpacked from the asar in packaged builds (`asarUnpack` in `electron-builder.json`; the path is rewritten `app.asar` → `app.asar.unpacked`). If you rename or move it, update all three places.

### Settings

- `settings/store.ts` — in-memory cache over `userData/settings.json`, with a change-listener API (`onSettingsChange`); the tray rebuilds its menu when the shortcut changes.
- `settings/parse-settings.ts` — validates whatever is on disk and falls back to `DEFAULT_SETTINGS` per field. Add new persisted settings here and to `StoredSettings` in `src/shared/settings.ts`.
- `launchAtLogin` is not stored; it's read from/written to `app.getLoginItemSettings()` and merged into `AppSettings` at IPC time.

### IPC

Adding an IPC call touches: the channel name in `src/shared/ipc.ts`, a handler in `src/main/settings/ipc.ts` (handlers validate argument types at runtime since they receive `unknown`), and the bridge in `src/preload.ts`. Renderer types for `window.settings` / `window.updater` are derived from the preload objects (`SettingsApi`, `UpdaterApi`) in `src/renderer/global.d.ts`, so no separate type declaration is needed.

Shortcut recording in the settings window calls `pauseShortcut` so the global shortcut doesn't fire while the user presses keys; it's re-registered on `resumeShortcut` or when the sender's webContents is destroyed.

### Updates

`updater.ts` uses `electron-updater` against GitHub Releases (`publish` in `electron-builder.json`) with `autoDownload` off; it's imported lazily from the tray menu. Download progress goes to the `update` renderer page over `updater:progress`.

### Renderer CSP

A Content Security Policy meta tag is injected only in production builds (a custom plugin in `vite.config.ts`). Inline scripts and remote resources will be blocked in the built app even if they work in dev.
