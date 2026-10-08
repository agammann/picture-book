# Verification — October 2, 2026

The current app offers device generation and optional visitor-funded GPT-5.4 text adaptation. These checks used Windows, Edge 154, Node 24.19, and an AMD RDNA 3 WebGPU adapter with shader-f16 support. They establish the observed paths below, not universal device support or model accuracy.

- The production client and Worker build passed. All 27 automated tests passed, covering ordered source sections, exact manual pagination, import size cancellation, safe local imports/exports, hosted request boundaries, provider failures, malformed responses, cancellation, and client disconnection.
- A real Qwen 3 4B adaptation completed. Review found that it incorrectly listed the lighthouse and lantern as characters and wrote weak or underspecified scenes. The device mode remains a draft tool requiring editorial review. The smaller model choices were not included in this check.
- A stopped Qwen generation initially left the next call returning no result. Resetting the worker fixed the observed path: cancellation preserved the open book and immediate retry completed four spreads in about 77 seconds using cached weights.
- SD-Turbo generated a real 512 × 512 blue-lantern illustration after cancelling its first model download. Download, preparation and drawing completed in about 61 seconds on this run. The output showed a blue lantern with glass on a shelf. This single scene does not establish cast consistency or general image quality. The converted weights retain their noncommercial license.
- Two fixed fictional stories each used one real GPT-5.4 request, taking about 7 and 11 seconds. The first retained the plot, fragile-frame cause, ending and correct named cast, but added unsupported scene locations. A general location-grounding instruction was added afterward; that story was not rerun during this earlier check. The second preserved the distinction between people, a dog, a station name and an inscription, as well as the flood, missing train and uncertain ending. It passed the seven criteria fixed before generation. These are two examples, not a broad quality benchmark.
- Both hosted books exported successfully with their original source intact. Checks found no key in Web Storage, IndexedDB or exported projects. Clear key, mode switch and reload removed the key. A controlled held-request UI check verified Stop clearing the key without a provider call. Unit checks cover pending-request/body cancellation, image-conversion cancellation, and aborting upstream work when a local client disconnects.
- The compiled Worker ran in actual workerd through Wrangler 4.92. A synthetic invalid key reached OpenAI and returned a sanitized 401. Missing key, foreign origin, unsupported method, configuration and static asset paths also passed. No paid inference ran in that runtime check.
- Actual TXT, Markdown, HTML, selectable-text PDF, DOCX and public HTTPS imports passed. An oversized HTML source was rejected without truncation. Cancelling the file picker preserved the open dialog and source.
- Manual creation produced exactly the selected four spreads and retained the ending. Editing, undo/redo, add/delete, project reimport, library use and read-mode navigation passed. Real PDF, PNG and editable-project exports were inspected; Alice's export had all 24 readable pages. Editing and project export also worked in an already-open offline session; opening the website offline was not claimed.
- The editor, new-book dialog, character panel and library had no horizontal overflow at 1440, 390 or 320 pixels. The native WebMCP `read_picture_book` and `show_picture_book_spread` tools executed in Edge with its experimental feature enabled. Both tools also executed after an actual back/forward-cache restoration, and the temporary key was cleared. Other browser-agent integrations were not covered.
- The Windows portable folder was built using Electron 43.4.1 and actually launched on local port 4174 with an isolated profile. Manual editing persisted through reload, and the hosted route rejected an absent key. Device inference was tested in Edge, not repeated in Electron. The package remains unsigned.

Generated content always needs review. Structural validation cannot establish source fidelity, and a successful image or story on this machine cannot establish compatibility on every phone or graphics adapter. Private test fixtures and verification credentials are excluded from this repository and its source archive.

## Production hosted-text follow-up — October 3, 2026 (UTC)

The [published Studio](https://picture-book-studio.alx21.chatgpt.site) v4, source `a243cc26940b732794cf9eaa514d1fe372a8e06e`, was checked in Edge **154.0.4258.48**. Each short fictional English story produced four spreads through the deployed Worker with exactly one GPT-5.4 request and no retry. Both returned HTTP 200. Independent review compared the actual responses with the unchanged criteria fixed before generation.

| Story | Time | Criteria passed | Observed result |
| --- | --- | --- | --- |
| Willow Station | 17.9 seconds | 7 of 7 | Preserved the cast, sequence, dog waiting outside, flood and missing train, bell custody, and unresolved ending. |
| Lantern | 6.4 seconds | 11 of 11 | Preserved the joint repair, fragile-frame cause, sunset return, bread gift and ending; cast and scene grounding met the criteria. |

Both books rendered and downloaded with their original source intact and their cast and four spreads matching the responses. The key was absent from exported projects and browser storage. Clear key, switching modes and reload removed it while the generated book survived reload. Layout checks passed at 1440, 390 and 320 pixels, with no page or console errors.

The earlier Lantern result remains **10 of 11**: it invented a workroom and placed the thank-you outside the lighthouse. The later pass does not establish general adaptation quality. Appearance details remain visual interpretations, and generated books still need editorial review. These two production calls did not generate illustrations or repeat device-model, Electron or native WebMCP checks; their earlier limits remain unchanged.

## Historical checks

The records below describe earlier revisions and examples; they are not additional tests of the current hosted mode.

# Earlier browser migration — September 30, 2026

At that revision, the website did not invoke a paid model provider. Story rewriting uses a browser text model; illustrations use WebGPU and SD-Turbo through ONNX Runtime Web. An old operator key cannot reactivate retired generation routes.

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


## Version 1.0.0 — October 7, 2026

The v1 delivery is an editable browser book and matching Windows x64 app. Manual text, imports, owned art, editing, save/recovery and exports need no model or API account. Optional generation produces drafts to review.

The source build and 29 Node tests passed on Windows with Node 24.19 and pnpm 11.19. Actual browser TXT, Markdown, HTML, selectable PDF and DOCX imports passed; absent/too-short source and damaged PDF/project imports were rejected without replacing the open book. The patched PDF.js importer destroys its loading task after both successful and failed extraction.

The Chrome 155.0.8059.12 check used a fictional four-spread book and owned portrait art. Whole-spread ordering, add/remove, undo/redo, save/reload and project recovery retained content and exact original-source whitespace. Imports received new identities. All eight exported PDF pages and the PNG reopened. Every PDF page was rendered and visually inspected: readable captions, complete portrait artwork and the unresolved ending remained present. Editable projects include embedded images and support 64 MB, separately from the 25 MB source-document limit.

Controlled damaged saved-copy, failed IndexedDB write, failed save/switch, missing artwork, failed/malformed provider and active cancellation checks passed. Damaged stored records were retained and valid library books remained available. Failed adaptation kept the current book and exact pending source/options. Stop cancelled the provider request and cleared its visitor key; no key appeared in browser storage or export. These failure checks use controlled provider responses, not additional live API calls.

Actual native Chrome tools read the visible book summary while omitting original-source fields and source-note contents, navigated a spread, rejected invalid navigation and registered without duplicates after reload. Edited captions can quote source material. Layouts at 1440, 1024, 800 and 500 pixels fit the viewport. Browser/manual runs had no page execution errors or external model/provider requests.

An actual Electron process used a disposable profile and stable port 4174. Import/edit/save, a real restart, version display and project export passed with context isolation, sandboxing and Node integration disabled. The paired ZIP consumer check also exercises the extracted executable and a fresh frozen source install. Source and Windows app share the version; the portable package records its exact release commit.

### First model results retained

The first live GPT-5.4 draft for **Mira's Paper Boat** completed in about 14 seconds and independently passed all twelve frozen story checks. It retained only Mira and orange cat Nori in the cast, the blue paper boat and yellow star, reed-caused hole and waxed-paper repair, dry path/shed/shelf locations, wind, source order and unresolved ending. One real request was made; this short-story result does not establish fidelity for other books.

The first completed Qwen 3 4B draft ran on Edge 154.0.4258.62 with an AMD RDNA3 WebGPU adapter. It produced four spreads and retained the source, but incorrectly included the boat and pond as characters and lost causal/location details. Its scenes were too vague to establish that Nori stayed outside the shed. It is a draft to edit, not a dependable automatic retelling.

All four first SD-Turbo illustrations rendered on the same device. Every image contradicted a supplied scene detail: extra people/cats, a boat or cat in water, the cat inside the shed, or missing boat/star details. These first outputs were retained. No replacement generation turned them into passing results. Use owned artwork when source fidelity matters, and inspect its portrait-page crop.

Initial text-download and image-generation cancellation preserved the old book and pending inputs. The image run made no hosted adaptation requests. Text/image workers were stopped afterward. Device compatibility was checked on this browser/GPU; other devices and memory configurations are different environments.
