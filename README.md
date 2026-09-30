# Picture Book

Turn a long or difficult book into a fun, easy-to-read picture book. Free software, MIT licensed. Use the website in your browser, or choose the optional portable Windows desktop app.

## Use Picture Book online

**[Open Picture Book](https://picture-book-studio.alx21.chatgpt.site)** — no app installation required; model files download on first generation.

Read Alice's Adventures in Wonderland immediately, or choose **New book** to upload your own book, paste text, or import a public web page. Choose a browser text model in **Settings** or adapt a story directly. Generation uses your device, with no API key or paid AI API. Reading, editing, local imports and exports remain available without a model.

Books stay in this browser on this device. Export an editable project to back up your work or move it to another device. The website requires an internet connection to open; the optional Windows version runs locally.

## Read the showcase

**Alice’s Adventures in Wonderland is the main showcase and opens on a first visit.** The Time Machine is a second example. Both adaptations use simple language, a connected story, and the original ending. Each has 12 illustrated spreads across 24 pages. These examples were edited and reviewed after generation.

| Alice's Adventures in Wonderland | The Time Machine |
| --- | --- |
| [![Alice beside the little door](examples/alice-in-wonderland/cover.webp)](examples/alice-in-wonderland/book.pdf) | [![The inventor demonstrates his model](examples/the-time-machine/cover.webp)](examples/the-time-machine/book.pdf) |
| [Read PDF](examples/alice-in-wonderland/book.pdf) · [Editable project](examples/alice-in-wonderland/book.picturebook.json) | [Read PDF](examples/the-time-machine/book.pdf) · [Editable project](examples/the-time-machine/book.picturebook.json) |

Download an editable project, then choose **New book → Choose a file** to open it. Public example projects include the adaptation and illustrations, with the original uploaded document removed. [About the examples](examples/README.md).

## Our storytelling standard

Make each story welcoming and easy to follow. Keep the important causes, choices, consequences, and real ending. Give the opening, central journey, and resolution enough room. Use familiar words without losing the story's meaning, and make each illustration agree with its page. A tragic or uncertain ending remains tragic or uncertain. Quality comes from careful execution and review.

## What you can do

- Import text PDFs, DOCX, text, Markdown, HTML, or a public web page.
- Adapt a story into 8, 12, 16, 24, 32, or 48 pages, then edit every spread.
- Choose an art style, reading level, and language. Simple language is the default: short sentences, familiar words, and a story that reaches its real ending.
- Maintain character descriptions and a visual reference for manual review. Browser illustration uses descriptions; it does not condition on reference images.
- Generate one illustration or all missing illustrations; upload your own art.
- Undo and redo edits, read a book full screen, or use the browser's read-aloud voice.
- Save books on your device and export a printable PDF, an illustration PNG, or an editable project.
- Read, edit, and export in your browser without installing an app. Books are saved in this browser; keep an exported project as a backup.

Picture Book has no paywall or export watermark. Browser models process story and illustration prompts locally. Manual editing and exports need no model.

## Run locally

Install Node.js 22.12 or newer, then:

```sh
npm install
npm run build
npm run preview
```

Open **http://127.0.0.1:4173**. No provider key or environment variable is needed. Browser inference requires WebGPU and compatible graphics hardware.

For a reproducible dependency install, use pnpm 11.19.0 with `pnpm install --frozen-lockfile`. The lockfile is included. CI checks the production build and core tests.

For development, run the local server in one terminal and `npm run dev` in another. Vite serves the editor at port 5173 and proxies API requests to port 4173.

## Windows desktop

Run `npm run build`, then `npm run desktop`, or create a portable folder with `npm run desktop:pack`. The package uses the installed Electron runtime. Run `Picture Book.exe` and keep its accompanying files together. Desktop uses local port 4174 and a single application instance so the storage origin stays stable. The portable package is unsigned.

## Browser models

The first run downloads model files from public hosts. Text generation runs in a dedicated browser worker using WebLLM; prompts are not sent to a hosted model. This workflow defaults to Qwen 3 4B. Smaller Qwen 3 1.7B and Llama 3.2 1B choices use less memory but can produce substantially weaker drafts. Model downloads are cached when browser storage permits.

Use HTTPS (or localhost) and a current browser with WebGPU and compatible graphics hardware. A model choice does not guarantee that every device has enough memory. Download speed, inference speed and answer quality depend on the device and model. Stop a download or generation from the interface; errors preserve existing inputs. There is no paid model fallback. Hosting and model-download bandwidth remain separate from AI API fees.

SD-Turbo provides 512 × 512 draft illustrations using ONNX Runtime Web and WebGPU. Its first download is about 2.4 GB. It uses more graphics memory than the text model, which is unloaded before drawing. Image prompts are limited by the model's short text encoder; scene or character details may be lost. Reference-image conditioning from the prior provider edition is unavailable. Upload your own art if quality, licensing or device support does not suit the project.

The selected converted image weights retain their [noncommercial license](https://huggingface.co/schmuell/sd-turbo-ort-web/blob/main/LICENSE). MIT licensing of the application does not replace model licenses. The pipeline follows the MIT-licensed [Microsoft ONNX Runtime Web example](https://github.com/microsoft/onnxruntime-inference-examples/tree/main/js/sd-turbo).

## Import and export details

PDFs must contain selectable text; scanned pages require OCR first. Files are limited to 25 MB, source text to 600,000 characters, and PDFs to 1,500 pages. Website import supports public HTTPS HTML/text pages; download a PDF or DOCX link and upload the file instead. Some websites block import.

Generation is a draft: review names, facts, chronology, and visual continuity. Long books are condensed in sections, and details can be lost. The resulting source is divided in order before each spread is rewritten; this preserves the section order but does not prove that every generated sentence is faithful. Image consistency is an aim, not a guarantee. Longer books and image revisions require more time and graphics work on your device.

Completed reading sections are cached on this device so retries can resume. Errors remain visible until dismissed. Finished illustrations are saved one at a time. Stopping drawing terminates the image worker; already finished illustrations remain saved.

Local and desktop exports are saved in **Downloads/Picture Book**, preserving existing files. Hosted web exports use your browser’s download flow and leave a Save link available. PDF exports have portrait pages matching the editor and rasterized text. Editable projects include the original source and all artwork. Export before clearing browser data or moving devices. Browser storage is not a cloud backup.

Use stories you own, have permission to adapt, or that are in the public domain. No third-party novel PDF is distributed in this project.

## Privacy

Books are saved in IndexedDB on your device. File imports, editing, story adaptation and illustration prompts are processed locally. Public hosts supply SDK/runtime code and model weights. Website import sends only the requested URL through the app server. There are no app accounts, analytics or cloud book storage. Hosting, model hosts and imported sites may retain ordinary request metadata. Exports can contain original source and all artwork; treat them accordingly.

## Development and distribution

```sh
npm test
npm run build
npm run package:source
```

`dist/client` contains the browser app; `dist/server/index.js` is a worker for a host exposing an `ASSETS` fetch binding. The Node server can also serve the complete app. Set the worker asset binding and SPA fallback according to your host. `.openai/hosting.json` associates a checkout with a Sites project when used with Sites.

The source archive uses an explicit file allowlist and includes the two reviewed examples and excludes keys, private local books, dependencies, build output, and account-specific hosting metadata.

## License

MIT. See [LICENSE](LICENSE).
