// Unit coverage for the pure chunking utility, including defaults, blank input, and overlap behavior.
const { chunkText } = require('../src/chunking/chunkText');
describe('chunkText TODOs', () => {
  test('short text is one chunk', () => expect(chunkText('hello')).toEqual(['hello']));
  test('blank text yields no chunks', () => expect(chunkText('   ')).toEqual([]));
  test('long chunks obey max size and overlap', () => {
    const chunks = chunkText('a'.repeat(1200));
    expect(chunks.every(c => c.length <= 500)).toBe(true);
    expect(chunks[0].slice(-100)).toBe(chunks[1].slice(0, 100));
    expect(chunks.every(chunk => chunk.length > 0)).toBe(true);
  });
  test('text exactly 500 characters produces one chunk', () => {
    expect(chunkText('a'.repeat(500))).toEqual(['a'.repeat(500)]);
  });
  test('chunking does not mutate the input', () => {
    const input = '  unchanged text  ';
    chunkText(input);
    expect(input).toBe('  unchanged text  ');
  });
});
