// Storage interface for document and chunk persistence.
// Services depend on this contract, so an implementation can be replaced later
// without changing ingestion or search logic.
class VectorStore {
  saveDocument(_document) {
    throw new Error('VectorStore.saveDocument must be implemented');
  }

  getDocument(_id) {
    throw new Error('VectorStore.getDocument must be implemented');
  }

  saveChunks(_chunks) {
    throw new Error('VectorStore.saveChunks must be implemented');
  }

  getChunks() {
    throw new Error('VectorStore.getChunks must be implemented');
  }

  clear() {
    throw new Error('VectorStore.clear must be implemented');
  }
}

module.exports = { VectorStore };
