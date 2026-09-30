# Browser migration verification — September 30, 2026

The website no longer invokes a paid model provider. Story rewriting uses a browser text model; illustrations use WebGPU and SD-Turbo through ONNX Runtime Web. An old operator key cannot reactivate retired generation routes.

- The final production browser and worker build completed locally.
- Ten automated tests passed, including source-section ordering and completeness, invalid layouts, import limits, local-origin protections, portable project validation and exact export bytes.
- Real browser inference ran in Edge on a Windows laptop with an NVIDIA RTX 3050 6 GB. Qwen 3 4B produced a four-spread garden-gate adaptation, including its final thank-you and shared tea. Its language and scenes still needed editorial review; this is not an accuracy benchmark.
- A real SD-Turbo WebGPU run produced a 512 × 512 PNG after downloading the model files. It is a draft illustration, with no reference-image conditioning.
- The observed runs made no requests to paid inference endpoints. Model assets and SDK code still download from public hosts.
- Unsupported-device and stopped-download paths preserved the input and allowed retry. Four app interfaces were checked at a 390 × 844 mobile viewport; generation was verified on the laptop, not on every phone.

The selected image weights have a separate noncommercial license. See the README and `public/THIRD-PARTY-NOTICES.txt`. Browser model results require human review for omissions, invented details, chronology and visual continuity. A successful run does not establish support on every device.

## Historical provider edition and reviewed examples

> This ledger describes the earlier provider edition and reviewed example books. Browser migration checks are recorded separately; prior model quality claims do not establish browser model quality.


## Current scope

Picture Book provides a browser website and a portable Windows package. Alice's Adventures in Wonderland is the first-visit showcase. The Time Machine is an additional complete example. The earlier original sample and unused demonstration books are excluded from the source and release folders. The public website is hosted on [ChatGPT Sites](https://picture-book-studio.alx21.chatgpt.site). Browser installation features have been removed.

## Verified behavior

- The production browser build and server worker build completed locally.
- Eight core tests passed, including import validation, source splitting, local server behavior, cast matching for image references, and exact local export bytes without overwriting existing files.
- Both selected books contain 12 illustrated spreads and 24 PDF pages. Their adaptation prose was manually reviewed and simplified. Each reaches the original ending.
- Image review found extraneous cast members. Scene prompts now contain only named recurring characters, and image references require a matching cast. Revised scenes were inspected again.
- The Time Machine also received three prop corrections so its machine is not present while missing in the story. The final riverbank, museum, and forest illustrations were inspected with the accompanying story.
- Both exported PDFs were rendered into contact sheets and visually reviewed for page order, legible text, complete endings, and image placement. The PDFs use rasterized text.
- Local exports save in Downloads/Picture Book. A browser Save link remains available as a fallback. Files are never overwritten; repeated exports receive numbered filenames.
- Public editable examples have empty source.text fields. Uploaded PDFs and their extracted full text are not distributed.
- The desktop server was previously verified on its stable local port without a bundled API key. The portable package is unsigned.

## Visual comparison ledger

The concept is `work/art/picture-book-editor-concept.png` in the development workspace. It was inspected with the image viewer and compared with current Browser/IAB screenshots. The browser viewport override did not affect the live viewport, so fixed-width frames exercised the actual application at 390px and 1536px. The browser did not expose a documented screenshot-to-file operation; current render screenshots were inspected inline rather than through a local image file.

| Point | Concept | Render and decision |
| --- | --- | --- |
| Copy | Picture Book, My library, New book, Settings, Read, Export | Preserved. Characters, save status, undo/redo and source notes are intentional functional additions. |
| Layout | Narrow page rail, central open book, right inspector | Same three-region editor; desktop frame checked at 1536px. |
| Typography | Serif title, book text and controls | Georgia used consistently; document text scales with the page container. |
| Palette | Warm ivory, dark ink, cobalt controls | Preserved with light rules and a restrained paper shadow. |
| Artwork | Full-bleed watercolor opposite text and botanical detail | Reviewed showcase illustrations and botanical artwork; no tint overlay. Images are distinct production assets rather than a flattened concept screenshot. |
| Responsive layout | Concept specifies desktop only | Mobile intentionally stacks art and text pages, moves the rail horizontally and places the inspector below. Body had no horizontal overflow at 390px. |
| Navigation | Labeled desktop controls | Mobile hidden captions initially removed accessible names and hid the library. Added explicit labels and restored library access; the mobile library opened successfully. |

The editorial visual system was checked against the concept. Artwork crops, live thumbnails, responsive stacking and functional controls are intentional differences; this is not a pixel-identical copy. The PDF export uses rasterized text.

## Remaining limitations

Generated drafts still require editorial and visual review. The examples are reviewed adaptations, not unedited model output. Real local-model services have not been tested. Provider refusals stop the affected illustration while preserving completed work. No comparative claim against another app has been tested.
