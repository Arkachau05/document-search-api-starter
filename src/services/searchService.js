// Search use case: vectorizes queries, ranks stored chunks, and applies document metadata filters.
const { embeddingProvider } = require('../providers');
const { vectorStore } = require('../store');
function cosineSimilarity(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) throw new TypeError('vectors must be arrays');
  if (a.length !== b.length) throw new RangeError('vectors must have the same dimensions');

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;
  for (let index = 0; index < a.length; index += 1) {
    dotProduct += a[index] * b[index];
    magnitudeA += a[index] * a[index];
    magnitudeB += b[index] * b[index];
  }
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}
async function searchDocuments({ query, topK = 5, filters = {} }) {
  const queryVector = await embeddingProvider.embed(query);
  const filterEntries = Object.entries(filters);
  const results = vectorStore.getChunks()
    .filter(chunk => {
      const document = vectorStore.getDocument(chunk.documentId);
      return document && filterEntries.every(([key, value]) => document.metadata[key] === value);
    })
    .map(chunk => {
      const document = vectorStore.getDocument(chunk.documentId);
      return {
        documentId: chunk.documentId,
        title: document.title,
        chunkId: chunk.id,
        content: chunk.content,
        score: cosineSimilarity(queryVector, chunk.vector)
      };
    })
    .sort((a, b) => b.score - a.score || a.chunkId.localeCompare(b.chunkId));
  return results.slice(0, topK);
}
module.exports = { searchDocuments, cosineSimilarity };
