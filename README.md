# Pluck

A tiny menu bar utility for macOS that copies text from anywhere on your screen. Select an area with a shortcut and its text is instantly copied to your clipboard.

https://github.com/user-attachments/assets/31a9c210-b923-4e0f-bdfb-4cbb864b2e9d

## Features

- **Copy text from anywhere** — press <kbd>⇧</kbd> <kbd>⌘</kbd> <kbd>T</kbd> (configurable), select an area and its text lands in your clipboard
- **On-device recognition** — powered by Apple Vision, works offline and detects the language automatically, including Cyrillic
- **Sound feedback** — a shutter sound when text is copied, an alert when no text is found
- **Keep line breaks** — copy text line by line or join it into a single line
- **Launch at login** — always ready in the menu bar, never in the Dock
- **Check for updates** — download new versions right from the menu

## Install

1. Download the latest `Pluck-<version>-arm64.dmg` from [Releases](https://github.com/BohdanShh/pluck/releases/latest)
2. Open it and drag **Pluck** to **Applications**
3. Launch Pluck — it appears in the menu bar
4. On the first capture, allow **Screen Recording** in System Settings → Privacy & Security

Requires macOS 13 or later on Apple silicon.

## Development

Requires [Bun](https://bun.sh) and Xcode (text recognition is a small Swift helper).

```sh
bun install
bun run dev
```

| Command             | Description                                           |
| ------------------- | ----------------------------------------------------- |
| `bun run dev`       | Start the app with hot reload                         |
| `bun run build`     | Build the renderer, main process and Swift helper     |
| `bun run start`     | Run the built app                                     |
| `bun run dist`      | Package a signed and notarized `.dmg` into `release/` |
| `bun run format`    | Format the code with Prettier                         |
| `bun run lint`      | Lint the code with Oxlint                             |
| `bun run typecheck` | Type check the code with TypeScript                   |

### Packaging

`bun run dist` signs the app and the `.dmg` with a Developer ID Application certificate from your keychain and notarizes both with Apple. Store your notarization credentials once:

```sh
xcrun notarytool store-credentials notary \
  --key ~/.private_keys/AuthKey_<KEY_ID>.p8 \
  --key-id <KEY_ID> \
  --issuer <ISSUER_ID>
```

Then build:

```sh
bun run dist
```

To use a profile with a different name, set `APPLE_KEYCHAIN_PROFILE`.

Building the app icon requires Xcode 26 or later.

## Tech stack

Electron, React 19, Vite, Tailwind CSS v4 and a native Swift helper built on Apple Vision's `VNRecognizeTextRequest`.
