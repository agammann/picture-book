import test from 'node:test';
import assert from 'node:assert/strict';
import { storySections } from '../shared/story-sections.mjs';

test('source sections preserve all words and the ending in order without inventing outline events', () => {
  const source = 'Mira found a gate.\nShe called Leo! They measured the wood. Rain interrupted them...\nThey waited. The next morning they finished. Grandmother thanked them.';
  for (const count of [1, 4, 12]) {
    const sections = storySections(source, count);
    assert.equal(sections.length, count);
    assert.ok(sections.every(s => s.length > 0));
    assert.equal(sections.join(' '), source.trim().replace(/\s+/g, ' '));
    assert.ok(sections.at(-1).endsWith('them.'));
  }
});

test('invalid or impossible layouts fail before generation', () => {
  for (const count of [0, 1.5, 49, NaN]) assert.throws(() => storySections('Some story.', count));
  assert.throws(() => storySections('', 4));
  assert.throws(() => storySections('Too short.', 4));
});
