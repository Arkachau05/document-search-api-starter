/**
 * Pure text-chunking utility for the ingestion pipeline.
 * The API layer calls this module, while tests verify chunk size and overlap independently.
 */
/** Split text into chunks, max 500 chars with 100-char overlap. */
function chunkText(text, maxSize = 500, overlap = 100) {
  if (typeof text !== 'string') throw new TypeError('text must be a string');
  if (!Number.isInteger(maxSize) || maxSize <= 0) throw new RangeError('maxSize must be a positive integer');
  if (!Number.isInteger(overlap) || overlap < 0 || overlap >= maxSize) {
    throw new RangeError('overlap must be a non-negative integer smaller than maxSize');
  }

  const trimmedText = text.trim();
  if (!trimmedText) return [];

  const chunks = [];
  let start = 0;
  while (start < trimmedText.length) {
    chunks.push(trimmedText.slice(start, start + maxSize));
    if (start + maxSize >= trimmedText.length) break;
    start += maxSize - overlap;
  }
  return chunks;
}
module.exports = { chunkText };
