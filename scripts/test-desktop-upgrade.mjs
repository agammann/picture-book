import { _electron as electron } from 'playwright';
import assert from 'node:assert/strict';
import { cp, mkdir, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

if (process.platform !== 'win32') throw new Error('This test requires Windows.');
const priorRoot = process.env.PICTURE_BOOK_PRIOR_ROOT;
const currentExe = process.env.PICTURE_BOOK_TEST_DESKTOP;
if (!priorRoot || !currentExe) throw new Error('Both test package paths are required.');
const entries = await readdir(priorRoot, { withFileTypes: true });
assert.equal(entries.length, 1, 'Prior release must contain a single root.');
assert(entries[0].isDirectory());
const priorExe = path.join(priorRoot, entries[0].name, 'Picture Book.exe');
const out = path.resolve('test-results/desktop-upgrade');
const profile = path.join(out, `profile-${Date.now()}`);
await mkdir(profile, { recursive: true });
const fixture = path.resolve('tests/fixtures/paper-boat.picturebook.json');
const source = JSON.parse(await readFile(fixture, 'utf8'));
let app;
async function launch(executablePath, expectedElectron) {
  app = await electron.launch({ executablePath, args: [`--data-dir=${profile}`],
    env: { ...process.env, HOME: path.join(out, 'home'), USERPROFILE: path.join(out, 'home'),
      APPDATA: path.join(out, 'home/AppData/Roaming'), LOCALAPPDATA: path.join(out, 'home/AppData/Local') }, timeout: 60000 });
  const actual = await app.evaluate(({ app }) => ({ profile: app.getPath('userData'), electron: process.versions.electron }));
  assert.equal(path.resolve(actual.profile), profile);
  assert.equal(actual.electron, expectedElectron);
  const page = await app.firstWindow();
  page.setDefaultTimeout(20000);
  await page.getByRole('button', { name: 'New book', exact: true }).waitFor();
  return page;
}
try {
  let page = await launch(priorExe, '43.8.1');
  await page.getByRole('button', { name: 'New book', exact: true }).click();
  const chooser = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Choose a file', exact: true }).click();
  await (await chooser).setFiles(fixture);
  await page.locator('dialog').waitFor({ state: 'hidden' });
  const story = await page.getByRole('textbox', { name: 'Story', exact: true }).inputValue();
  const revised = `${story} Synthetic upgrade revision.`;
  await page.getByRole('textbox', { name: 'Story', exact: true }).fill(revised);
  await page.getByText('Saved on this device', { exact: true }).waitFor({ state: 'attached' });
  await app.close(); app = null;
  await cp(profile, path.join(out, 'prior-profile-backup'), { recursive: true, errorOnExist: true, force: false });
  page = await launch(currentExe, '45.3.1');
  assert.equal(await page.getByRole('textbox', { name: 'Story', exact: true }).inputValue(), revised);
  await page.getByRole('button', { name: 'Export', exact: true }).click();
  const response = page.waitForResponse(r => r.url().endsWith('/api/export'));
  await page.getByRole('button', { name: /^Save editable project/ }).click();
  const result = await (await response).json();
  assert(path.resolve(result.path).startsWith(path.resolve(path.join(out, 'home', 'Downloads')) + path.sep));
  const exported = JSON.parse(await readFile(result.path, 'utf8'));
  assert.equal(exported.source.text, source.source.text);
  assert(exported.pages[0].text.endsWith(' Synthetic upgrade revision.'));
  console.log('Electron 43 to 45 preserved and exported the synthetic book.');
} finally {
  await app?.close();
}
