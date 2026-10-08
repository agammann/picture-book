# Development

[Back to Picture Book](../README.md)

Use Node.js 24.19 or newer and pnpm 11.19.0. The frozen lockfile is the supported install. `pnpm install --frozen-lockfile --ignore-scripts` is sufficient for web work; `node node_modules/electron/install.js` downloads the pinned desktop runtime when building/testing Windows.

```sh
pnpm check
pnpm exec playwright install chromium
pnpm test:browser
```

`pnpm check` builds the browser and host worker before the Node tests. The browser suite uses a fictional source, four owned schematic images and isolated browser storage. It checks editing/order/undo, export/reopen, exact-source backup recovery, corrupted saved copies, failed writes, unreadable images, controlled failed/malformed/cancelled providers, credential exclusion and responsive layouts. It invokes actual native browser tools when supported by the test browser. No live API or device inference is part of CI. Native model quality is documented separately in [verification](VERIFICATION.md).

For a browser executable outside Playwright's installed Chromium, set `PICTURE_BOOK_TEST_CHROME` to its absolute path. The native tool input contract is checked with Chrome 155; other browser versions can differ. Native tools read the open book summary and navigate spreads. The returned edited captions and scene directions can quote source material, but the original-source field, source-note contents, image bytes and keys are omitted.

For development, run `pnpm preview` in one terminal and `pnpm dev` in another. Vite serves port 5173 and proxies the API to loopback port 4173. Build after production-source changes.

## Layout

- `src/` contains the React editor, import/export code and device model clients.
- `shared/` contains project validation, source partitioning, URL policy and scene/cast rules.
- `server/index.mjs` is the loopback Node server used by local and Windows editions.
- `server/worker.mjs` builds into `dist/server/index.js` for an ASSETS-bound host; `dist/client` contains the frontend.
- `public/` contains reviewed showcase assets and browser inference workers.
- `desktop/main.cjs` opens the isolated Electron renderer at stable port 4174.
- `tests/fixtures/` contains the fictional short book and owned test illustrations; use those instead of private source material.

The Node and worker adapters use the same visitor-key route. It targets the fixed OpenAI Responses endpoint, validates source and spread coverage, and requests `store:false`. There is no server-funded provider mode, account login or AWS service in this edition. Keep deployment bindings and audience settings in the actual host; the repository's `.openai/hosting.json` remains generic.

## Packaging and release

On Windows, from a clean committed checkout whose version matches `shared/version.mjs`:

```sh
pnpm install --frozen-lockfile --ignore-scripts
node node_modules/electron/install.js
pnpm check
pnpm test:browser
pnpm package:release
```

The source ZIP is a Git archive of the exact committed tree, including the lockfile, MIT license, fixtures, documents and authored showcases. The Windows ZIP contains the built frontend, local server, exact source commit in `resources/app/RELEASE.json`, Electron runtime/license notices and available dependency licenses. `SHA256SUMS` and individual checksums cover both archives. Output is under `release-artifacts/`; desktop staging is under ignored `release/`. Existing staging folders are rejected instead of overwritten.

The Windows/Linux verification workflow builds and tests an exact head. Windows also unpacks the paired ZIPs, installs the source consumer's frozen lockfile, and runs browser and actual portable-app checks. The publisher runs only after a successful main push, verifies the full asset set/checksums and current main/tag commit, uploads a draft release, verifies its assets, then publishes. Pull requests cannot publish.

Set `PICTURE_BOOK_TEST_DESKTOP` to the absolute extracted `Picture Book.exe` path and `PICTURE_BOOK_TEST_APP` to its `resources/app` folder when testing a portable consumer with `pnpm test:desktop`. The test launches an owned disposable `--data-dir` profile, verifies app version, imports a fictional project, edits/restarts and exports. It does not inspect your normal profile.
