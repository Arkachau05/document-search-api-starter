const { chunkText } = require('../src/chunking/chunkText');
describe('chunkText TODOs', () => {
  test('short text is one chunk', () => expect(chunkText('hello')).toEqual(['hello']));
  test('blank text yields no chunks', () => expect(chunkText('   ')).toEqual([]));
  test('long chunks obey max size and overlap', () => {
    const chunks = chunkText('a'.repeat(1200));
    expect(chunks.every(c => c.length <= 500)).toBe(true);
    expect(chunks[0].slice(-100)).toBe(chunks[1].slice(0, 100));
  });
});
