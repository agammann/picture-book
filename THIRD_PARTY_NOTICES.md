# Third-party notices

Picture Book's application source is MIT licensed. Its dependencies, downloaded model weights and runtime retain their own terms.

| Component | Version | License / upstream |
| --- | --- | --- |
| React and React DOM | 19.2.6 | MIT, https://github.com/facebook/react |
| lucide-react | 1.31.0 | ISC, https://github.com/lucide-icons/lucide |
| fflate | 0.8.3 | MIT, https://github.com/101arrowz/fflate |
| idb-keyval | 6.3.0 | Apache-2.0, https://github.com/jakearchibald/idb-keyval |
| pdf-lib | 1.17.1 | MIT, https://github.com/Hopding/pdf-lib |
| PDF.js / pdfjs-dist | 6.4.299 | Apache-2.0, https://github.com/mozilla/pdf.js |
| Electron | 43.7.9 | MIT, https://github.com/electron/electron; Chromium and runtime notices are included in the Windows package. |
| Vite, its React plugin and esbuild | 8.3.3 / 6.1.2 / 0.28.2 | MIT; build tooling, not required to launch the Windows package. |
| Playwright | 1.63.0 | Apache-2.0, https://github.com/microsoft/playwright; verification tooling. |

The Windows package retains Electron's `LICENSE`, `LICENSES.chromium.html` and available dependency license files under `resources/app/third-party/`. See the exact dependency lockfile and those files for additional terms.

Device runtime code is downloaded when requested: WebLLM 0.2.85 (Apache-2.0), ONNX Runtime Web 1.30.0 (MIT) and Transformers.js 3.8.1 (Apache-2.0). The image pipeline follows the MIT-licensed Microsoft ONNX Runtime Web SD-Turbo example. These downloaded libraries and weights are not bundled in the release ZIPs.

Qwen 3 weights have Apache-2.0 terms. Llama 3.2 uses the Llama community license. The selected converted [SD-Turbo weights](https://huggingface.co/schmuell/sd-turbo-ort-web/blob/ace89b7d2cd849f9a73914cdbb8a3ea60c853dd1/LICENSE) retain a noncommercial license. Check the selected model's upstream license before using its outputs or redistributing weights. The application license does not replace these terms.

The reviewed public-domain-story adaptations and their artwork remain in `examples/` and `public/showcase/`. Their original uploaded source documents are not distributed. The fictional test story and schematic test images are included under this repository's MIT license.
