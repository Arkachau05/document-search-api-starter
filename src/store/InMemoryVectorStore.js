class InMemoryVectorStore {
  constructor() { this.documents = new Map(); this.chunks = new Map(); }
  saveDocument(document) { // TODO: persist document summary and metadata.
    throw new Error('TODO: implement saveDocument');
  }
  getDocument(id) { // TODO: return document or null.
    throw new Error('TODO: implement getDocument');
  }
  saveChunks(chunks) { // TODO: persist chunks and vectors.
    throw new Error('TODO: implement saveChunks');
  }
  getChunks() { // TODO: return stored chunks for ranking/filtering.
    throw new Error('TODO: implement getChunks');
  }
  clear() { this.documents.clear(); this.chunks.clear(); }
}
const vectorStore = new InMemoryVectorStore();
module.exports = { InMemoryVectorStore, vectorStore };
