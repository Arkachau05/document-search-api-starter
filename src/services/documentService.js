const crypto = require('node:crypto');
const { chunkText } = require('../chunking/chunkText');
const { embeddingProvider } = require('../providers');
const { vectorStore } = require('../store/InMemoryVectorStore');
async function ingestDocument({ title, content, metadata = {} }) {
  // TODO: create ID, chunk content, embed every chunk, persist document/chunks,
  // and return { id, title, chunkCount }.
  void crypto; void chunkText; void embeddingProvider; void vectorStore;
  void title; void content; void metadata;
  throw new Error('TODO: implement ingestDocument');
}
function getDocument(id) {
  // TODO: return { id, title, chunkCount } or null.
  void id; void vectorStore;
  throw new Error('TODO: implement getDocument');
}
module.exports = { ingestDocument, getDocument };
