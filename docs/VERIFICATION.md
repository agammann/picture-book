# Verification notes

## Current scope

Picture Book provides a web editor, installable PWA assets and a portable Windows package. The public repository contains the application and an original illustrated sample. Public hosted deployment is pending.

## Verified behavior

- Local production build and five core tests passed.
- A clean Linux install with the committed pnpm lockfile passed its GitHub build and tests after correcting symlink resolution.
- Browser import of a 268-page selectable-text PDF produced 79,511 words. All 21 reading sections completed; completed sections were reused on retry.
- A 24-spread adaptation was produced. Editorial review found chronology, balance and ending omissions, so the demonstration draft was corrected and the general prompt was revised. The revised general prompt has not had a second paid full-novel adaptation run.
- The corrected draft covers a chronological beginning, central journey, climax and resolution. It is saved separately from the public source.
- Image generation succeeded on an earlier original-story test. The novel demonstration's character-reference request was rejected by the provider safety filter; no illustrations for that novel are claimed complete.
- The original sample exported through the app to an eight-page portrait PDF. All pages were rendered with PDFium and inspected; text and images fit the pages.
- The local desktop service started on its stable port without a bundled API key.
- WebMCP spread navigation reached the last spread and rejected an out-of-range spread.

## Visual comparison ledger

The concept is `work/art/picture-book-editor-concept.png` in the development workspace. It was inspected with the image viewer and compared with current Browser/IAB screenshots. The browser viewport override did not affect the live viewport, so fixed-width frames exercised the actual application at 390px and 1536px. The browser did not expose a documented screenshot-to-file operation; current render screenshots were inspected inline rather than through a local image file.

| Point | Concept | Render and decision |
| --- | --- | --- |
| Copy | Picture Book, My library, New book, Settings, Read, Export | Preserved. Characters, save status, undo/redo and source notes are intentional functional additions. |
| Layout | Narrow page rail, central open book, right inspector | Same three-region editor; desktop frame checked at 1536px. |
| Typography | Serif title, book text and controls | Georgia used consistently; document text scales with the page container. |
| Palette | Warm ivory, dark ink, cobalt controls | Preserved with light rules and a restrained paper shadow. |
| Artwork | Full-bleed watercolor opposite text and botanical detail | Dedicated sample images and botanical artwork; no tint overlay. Images are distinct production assets rather than a flattened concept screenshot. |
| Responsive layout | Concept specifies desktop only | Mobile intentionally stacks art and text pages, moves the rail horizontally and places the inspector below. Body had no horizontal overflow at 390px. |
| Navigation | Labeled desktop controls | Mobile hidden captions initially removed accessible names and hid the library. Added explicit labels and restored library access; the mobile library opened successfully. |

The editorial visual system was checked against the concept. Artwork crops, live thumbnails, responsive stacking and functional controls are intentional differences; this is not a pixel-identical copy. The PDF export uses rasterized text.

## Remaining limitations

Public hosting is not deployed. The Windows package is unsigned. Real local-model services and PWA installation on physical mobile devices have not been tested. Automatic narrative fidelity and image consistency still require review. A provider rejection preserves the book but prevents the requested illustration from completing.
