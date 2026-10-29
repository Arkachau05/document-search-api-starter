// In-memory implementation of the VectorStore contract. It is process-local and
// has no external database or vector-service dependency.
const { VectorStore } = require('./VectorStore');
class InMemoryVectorStore extends VectorStore {
  constructor() {
    super(); // Initialize the base VectorStore contract before adding the concrete maps.
    this.documents = new Map();
    this.chunks = new Map();
  }
  saveDocument(document) { // Persist a copy so callers cannot mutate store-owned data.
    this.documents.set(document.id, {
      ...document,
      metadata: document.metadata ? { ...document.metadata } : {}
    });
  }
  getDocument(id) {
    const document = this.documents.get(id);
    return document ? { ...document, metadata: { ...document.metadata } } : null;
  }
  saveChunks(chunks) { // Store each chunk and embedding for later metadata filtering and scoring.
    for (const chunk of chunks) this.chunks.set(chunk.id, { ...chunk, vector: [...chunk.vector] });
  }
  getChunks() {
    return [...this.chunks.values()].map(chunk => ({ ...chunk, vector: [...chunk.vector] }));
  }
  clear() { this.documents.clear(); this.chunks.clear(); }
}
const vectorStore = new InMemoryVectorStore();
module.exports = { InMemoryVectorStore, vectorStore };
