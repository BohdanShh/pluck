#!/bin/sh
set -eu

version=$(bun -p "require('./package.json').version")
identity=$(bun -p "require('./electron-builder.json').mac.identity")
dmg="release/Pluck-$version-arm64.dmg"

codesign --sign "Developer ID Application: $identity" --timestamp "$dmg"
xcrun notarytool submit "$dmg" --keychain-profile "$APPLE_KEYCHAIN_PROFILE" --wait
xcrun stapler staple "$dmg"
xcrun stapler validate "$dmg"
