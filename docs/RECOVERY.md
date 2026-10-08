# Backup and recovery

[Back to Picture Book](../README.md)

A successful **Saved on this device** status means the book was written to this browser's IndexedDB. It is not a cloud backup. Keep **Export → Save editable project** copies outside browser storage. The project contains the retained source, captions, scenes, cast, styles, descriptions and embedded images; use a new backup after meaningful edits.

## Reopen a project

Choose **New book → Choose a file** and select a `.picturebook.json` backup. Picture Book validates it before switching away from the open book. The import gets new book and spread identities, preserving existing library copies. Review every spread and source note. Original source whitespace and source URL are retained by project recovery.

A PDF and PNG are reading/artwork exports. They do not contain the complete editable project. Public showcase projects intentionally omit the originally uploaded document.

## Save failure

If the app reports **Not saved**, keep the tab open and export its editable project immediately. Do not clear site data or close the tab until the file is safely downloaded. Opening another book is blocked when the current book cannot be saved; your current edits stay visible. Browser quota, private-mode restrictions and permission settings can prevent storage writes. A project export can still work when IndexedDB cannot save.

Local and Windows exports are written to Downloads/Picture Book; existing files are kept and a numbered name is used for a new copy. Website downloads leave a Save link available. If artwork is missing or unreadable, replace it before export; the app will not silently turn that asset into an incomplete backup.

## Damaged saved copy

A malformed saved book shows recovery guidance rather than crashing the editor. Its original stored record is left untouched. Valid books still appear in My library. Import an exported project to create a recovered copy. A failed project import does not delete or overwrite existing books. Keep your original backup file until the recovered copy opens and all content is checked.

For development, use the tests' disposable browser/desktop profile. Do not experiment with production IndexedDB records or copy private books into this repository. The optional desktop `--data-dir` argument selects a separate absolute per-user profile for isolated testing.

## Before moving or clearing data

Export every book, copy the files to your own backup location, and reopen one to confirm it contains all spreads and art. Website, local source server and desktop app have separate storage origins; import the same backup into the target edition. API keys are not included and must be entered again only if you choose hosted generation.

Editable projects support up to 64 MB, matching the local export limit. If an export exceeds that budget, reduce the artwork size or split the book; no incomplete file is presented as a valid backup. Source-document imports have a separate 25 MB limit.
