// Interface contract for embedding implementations; concrete providers must return numeric vectors.
class EmbeddingProvider {
  async embed(_text) {
    throw new Error('EmbeddingProvider.embed must be implemented');
  }
}
module.exports = { EmbeddingProvider };
