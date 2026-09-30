export function storySections(text, count) {
  if (!Number.isInteger(count) || count < 1 || count > 48) throw Error('Choose a supported book length.');
  const source = text.trim().replace(/\s+/g, ' ');
  if (!source) throw Error('Add some story text first.');
  const sentences = source.split(/(?<=[.!?])\s+/u);
  const units = sentences.length >= count ? sentences : source.split(' ');
  if (units.length < count) throw Error('This source is too short for that many spreads. Choose a shorter book length.');
  return Array.from({ length: count }, (_, i) => units.slice(Math.floor(i * units.length / count), Math.floor((i + 1) * units.length / count)).join(' '));
}
