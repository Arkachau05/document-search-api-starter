// Application use case for document ingestion and lookup, connecting chunking, embeddings, and storage.
const crypto = require('node:crypto');
const { chunkText } = require('../chunking/chunkText');
const { embeddingProvider } = require('../providers');
const { vectorStore } = require('../store');
async function ingestDocument({ title, content, metadata = {} }) {
  const textChunks = chunkText(content);
  const id = `doc_${crypto.randomUUID()}`;
  const chunkRecords = [];

  for (let index = 0; index < textChunks.length; index += 1) {
    chunkRecords.push({
      id: `chunk_${crypto.randomUUID()}`,
      documentId: id,
      content: textChunks[index],
      position: index,
      vector: await embeddingProvider.embed(textChunks[index])
    });
  }

  vectorStore.saveDocument({ id, title, chunkCount: chunkRecords.length, metadata });
  vectorStore.saveChunks(chunkRecords);
  return { id, title, chunkCount: chunkRecords.length };
}
function getDocument(id) {
  const document = vectorStore.getDocument(id);
  if (!document) return null;
  return { id: document.id, title: document.title, chunkCount: document.chunkCount };
}
module.exports = { ingestDocument, getDocument };
