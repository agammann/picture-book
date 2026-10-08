# Installation and upgrades

[Back to Picture Book](../README.md)

## Web and local server

The public website needs no app installation. Reading, manual editing and exports need no model download. Browser generation needs HTTPS or localhost, WebGPU and compatible graphics memory. Books belong to the current browser profile and origin; export a project before changing either.

For a local source install, use Node.js 24.19 or newer and pnpm 11.19.0. Extract the source release, open a terminal in `picture-book-1.0.0`, and run:

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm build
pnpm preview
```

Visit http://127.0.0.1:4173. Keep that origin for subsequent sessions. The source server listens only on loopback; Ctrl+C stops it. No `.env`, API key or AWS setup is needed. Optional hosted text uses the key you enter in Settings for the current tab.

Upgrade by exporting each book first, extracting a newer source release into a separate folder, installing its lockfile and building it, stopping the old server, and starting the new server on the same origin. Verify the version in Settings, open your saved book and confirm its pages. Keep the exported projects until the upgrade is checked.

## Windows portable app

1. Download the Windows x64 ZIP and `SHA256SUMS` from the same release.
2. In PowerShell, run `Get-FileHash -Algorithm SHA256 -LiteralPath .\picture-book_1.0.0_windows-x64.zip` and compare the full hash with `SHA256SUMS`.
3. Extract the entire ZIP into a normal writable folder. Run **Picture Book.exe** inside the extracted `Picture-Book-Windows-1.0.0` folder, with all accompanying files present. Do not run it inside the ZIP.
4. Open Settings and check version 1.0.0. Read the showcase, import your own project or start manually.

The app is unsigned. Windows may request permission before launching an unsigned executable. The publisher does not provide a code-signing certificate. No Node, pnpm, provider account or key is needed for manual use. Device mode needs a supported GPU and internet access for its first downloads.

Books are in Electron's per-user application profile, not in the portable folder. The app uses port 4174 and one instance. Export projects before upgrading; extract the new ZIP into another folder, quit the previous app and launch the new version. The unchanged profile and localhost origin retain saved books. Switching between web, source-server and Windows editions requires exported project transfer.

For a developer build from source on Windows:

```sh
pnpm install --frozen-lockfile --ignore-scripts
node node_modules/electron/install.js
pnpm build
pnpm desktop
```

`pnpm desktop:pack` creates a portable folder from the installed Electron runtime. It refuses an existing destination; choose a fresh output path with `pnpm desktop:pack -- C:\path\to\new-folder`. The paired v1 release command is documented in [development](DEVELOPMENT.md).

## Troubleshooting

| Problem | Next step |
| --- | --- |
| The source server says the editor is not built | Run `pnpm build`, then start `pnpm preview` again. |
| Port 4173 or 4174 is already in use | Stop the previous server/app, or the process occupying that port. Do not change an existing library's origin without a project backup. |
| A model cannot load or runs out of graphics memory | Stop it; use manual editing and owned art, optional hosted text, a smaller text model or another supported device. There is no automatic paid fallback. |
| A saved book fails to open | Follow [recovery](RECOVERY.md). Stored damaged copies are retained; a backup import creates a new copy. |
| A PDF has no selectable text | Run OCR separately, or use a text source. Exported reading PDFs have rasterized text and do not restore editing data. |
| A picture fails to load during export | Replace it in Art → Upload your own art, then export again. |
| Hosted text fails | Check the visible message, key permissions and API billing. The app does not retry automatically; the current book and pending source remain available. |
