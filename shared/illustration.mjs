// Match whole names: Mouse must not match Dormouse. Parenthetical group labels
// describe the character list and are not required in the scene direction.
export function sceneCharacters(book, page) {
  const scene = String(page?.scene || '').toLocaleLowerCase();
  return book.characters.filter(character => {
    const name = character.name.replace(/\s*\([^)]*\)/g, '').trim().toLocaleLowerCase();
    if (!name) return false;
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}([^\\p{L}\\p{N}]|$)`, 'u').test(scene);
  });
}
export function sceneReference(book, page, cast) {
  const names = cast.map(c => c.name).sort();
  if (!names.length) return '';
  const sameCast = candidate => Array.isArray(candidate) &&
    JSON.stringify([...candidate].sort()) === JSON.stringify(names);
  // Unreviewed legacy art has no cast metadata and must not become a reference.
  const previous = book.pages.find(p => p.id !== page.id && p.image && sameCast(p.imageCast));
  if (previous) return previous.image;
  return book.referenceImage && sameCast(book.referenceCast) ? book.referenceImage : '';
}
