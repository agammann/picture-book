# Picture Book 1.0.0

Picture Book is a browser editor and optional portable Windows app for making illustrated books you can revise, read, export and build on. The application is free software under the MIT license.

**[Open Picture Book](https://picture-book-studio.alx21.chatgpt.site)** · **[Download the v1 release](https://github.com/agammann/picture-book/releases/tag/v1.0.0)**

Reading, editing, manual imports, owned artwork and exports need no account, key or model download. Start with the Alice showcase, or choose **New book** and import your story. Create 4, 6, 8, 12, 16 or 24 spreads; each spread has an illustration page and a facing story page.

## Make your first book

1. Choose **New book → Paste text**, enter a short story you own and its title, and choose **8 pages · 4 spreads**.
2. Choose **Start manually** to arrange your original words without running a model. A manual source must be under 12,000 characters. Longer sources can use the optional adaptation modes.
3. Edit the **Story**, page title and scene. Use the arrows beside the canvas zoom to move a whole spread earlier or later; its caption and artwork move together. Add or remove spreads and use Undo/Redo.
4. In **Art**, choose **Upload your own art** for each spread. PNG, JPG and WebP files up to 15 MB are supported. Portrait art near a 5:7 aspect ratio avoids the center crop used to fill a page. Inspect the visible crop and add a useful image description for readers using assistive technology.
5. Choose **Read** and inspect every caption and picture. Choose **Export → Save editable project** for a portable backup, **Download PDF** for all pages, or **Save this illustration** for the current art page.
6. Reopen a backup with **New book → Choose a file**. It creates a new library copy and retains your source, edits, characters and embedded artwork.

Books are saved in this browser on this device. An editable `.picturebook.json` file is your portable backup; a PDF or PNG cannot restore the editing project. Keep a backup before clearing browser data or changing devices. See [installation and upgrades](docs/INSTALLATION.md) and [recovery](docs/RECOVERY.md).

## Our storytelling standard

Make each story welcoming and easy to follow. Keep the important causes, choices, consequences, and real ending. Give the opening, central journey, and resolution enough room. Use familiar words without losing the story's meaning, and make each illustration agree with its page. A tragic or uncertain ending remains tragic or uncertain. Quality comes from careful execution and review.

## Optional generation

**On this device** is the default. Qwen 3 4B drafts text with WebLLM; smaller Qwen 3 1.7B and Llama 3.2 1B choices use less memory. SD-Turbo drafts 512 × 512 illustrations using ONNX Runtime Web. Use a current browser with WebGPU and compatible graphics memory. First-use weights download from public hosts; the image download is about 2.4 GB. Text is unloaded before drawing to free graphics memory. Downloads may be cached when browser storage allows.

These modes produce drafts. In the v1 fictional-story check, the device text included a boat and pond in the character list, and all four first illustrations added or changed important scene details. Check names, causes, chronology, the real ending, who is present and what each picture depicts. Edit the captions and cast, and upload your own art to replace a mismatch. The two reviewed showcases below are edited examples, not a promise that a new draft will match them automatically. The image model does not condition on your reference image; short prompts can lose details.

**Hosted text** is optional: choose **Settings → Story generation → Hosted text** and enter your own OpenAI API key. GPT-5.4 plans the book in one request, with a three-minute timeout and no automatic retry. It can incur charges on your API account. The first v1 fictional-story response passed all twelve frozen story checks, including the unresolved ending and the cat staying outside the shed. Review every new result; this single passing case does not guarantee every source. Hosted text does not generate paid images and has no operator-funded fallback.

Choose **Stop** to cancel a download or generation. Existing books and completed illustrations are kept. Failed adaptation keeps its pending source and options. A cancelled text worker reloads cached weights for a later task. See the [dated verification results](docs/VERIFICATION.md) for the tested device and limits.

## Read the showcases

Alice's Adventures in Wonderland opens on a first visit. The Time Machine is a second example. Each has 12 illustrated spreads across 24 pages, with simple language and the original ending. These examples were edited and reviewed after generation.

| Alice's Adventures in Wonderland | The Time Machine |
| --- | --- |
| [![Alice beside the little door](examples/alice-in-wonderland/cover.webp)](examples/alice-in-wonderland/book.pdf) | [![The inventor demonstrates his model](examples/the-time-machine/cover.webp)](examples/the-time-machine/book.pdf) |
| [Read PDF](examples/alice-in-wonderland/book.pdf) · [Editable project](examples/alice-in-wonderland/book.picturebook.json) | [Read PDF](examples/the-time-machine/book.pdf) · [Editable project](examples/the-time-machine/book.picturebook.json) |

Download a project and import it with **New book → Choose a file**. Public examples omit the original uploaded document. [About the examples](examples/README.md).

## Run from the source release

Install **Node.js 24.19 or newer** and **pnpm 11.19.0**. Download `picture-book_1.0.0_source.zip`, verify its SHA-256 against `SHA256SUMS`, and extract it. In the extracted `picture-book-1.0.0` folder:

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm build
pnpm preview
```

Open **http://127.0.0.1:4173**. No key or environment file is needed for manual or device mode. Optional hosted text uses the visitor key entered in Settings. The server reads no provider environment key. Stop the local server with Ctrl+C.

For a pinned Git checkout instead:

```sh
git clone --branch v1.0.0 https://github.com/agammann/picture-book.git
cd picture-book
```

Use the same install/build/preview commands. See [development](docs/DEVELOPMENT.md) for tests, API/hosting layout and packaging.

## Windows app

Download `picture-book_1.0.0_windows-x64.zip`, verify its checksum, extract the entire archive, and run **Picture Book.exe**. Keep all accompanying files together. No Node or pnpm installation is needed for this package. It is an unsigned Windows x64 build. Port **4174** must be free; a single app instance and stable origin retain the library across restarts and upgrades.

The source and Windows app share version 1.0.0, visible in **Settings**. `resources/app/RELEASE.json` identifies the Windows package's exact source commit. Upgrading does not move browser books into the desktop edition; import an exported project to transfer them. [Windows setup, build and upgrade instructions](docs/INSTALLATION.md#windows-portable-app).

## Import, export and privacy

Import selectable-text PDF, DOCX, TXT, Markdown, HTML, a public HTTPS text page or an editable Picture Book project. Source files are limited to 25 MB, editable projects to 64 MB, source text to 600,000 characters and PDFs to 1,500 pages. Scanned PDFs need OCR first. Protected pages may block import. A website's PDF or DOCX link must be downloaded and uploaded instead. Supported project imports retain up to 48 spreads; new-book options create up to 24.

Local and Windows exports go to **Downloads/Picture Book**, using numbered filenames to preserve earlier copies. Website exports use browser downloads and leave a Save link available. PDF pages are portrait and their text is rasterized. PNG contains the current art page. Editable projects include the exact retained original source and all embedded artwork. A missing or unreadable illustration blocks an editable export so it cannot become a silently incomplete backup.

File imports, editing, device adaptation and illustration prompts are processed locally. Hosted text sends the source, title and adaptation settings through the app server to the fixed OpenAI Responses API, using `store:false`; the provider's applicable retention policies still apply. Hosted input is limited to 600,000 characters and 900,000 UTF-8 bytes, with a separate serialized-input budget; oversized input is rejected.

Your API key stays in tab memory and is excluded from library records, browser storage and exports. **Clear key**, **Stop**, switching to device mode, leaving the page or reloading removes it. There are no app accounts, analytics or cloud book storage. Public hosts supply runtime code and model weights; website import retrieves the requested public page through the app server. Hosts may retain ordinary request metadata. Share exported original sources and images only when you intend to.

## License

The application and included test material are MIT licensed. See [LICENSE](LICENSE) and [third-party notices](THIRD_PARTY_NOTICES.md). Use stories and artwork you own, have permission to adapt, or that are in the public domain. The selected SD-Turbo converted weights retain their **[noncommercial model license](https://huggingface.co/schmuell/sd-turbo-ort-web/blob/ace89b7d2cd849f9a73914cdbb8a3ea60c853dd1/LICENSE)**; the application's MIT license does not change model terms. The image pipeline follows the MIT-licensed [Microsoft ONNX Runtime Web example](https://github.com/microsoft/onnxruntime-inference-examples/tree/main/js/sd-turbo).
