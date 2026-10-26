const { EmbeddingProvider } = require('./EmbeddingProvider');
/** Deterministic local mock; useful for repeatable tests, not a production semantic model. */
class MockEmbeddingProvider extends EmbeddingProvider {
  constructor(dimensions = 64) { super(); this.dimensions = dimensions; }
  async embed(text) {
    const vector = Array(this.dimensions).fill(0);
    const tokens = String(text).toLowerCase().match(/[a-z0-9]+/g) || [];
    for (const token of tokens) {
      let hash = 2166136261;
      for (let i = 0; i < token.length; i++) { hash ^= token.charCodeAt(i); hash = Math.imul(hash, 16777619); }
      vector[(hash >>> 0) % this.dimensions] += 1;
    }
    const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
    return norm ? vector.map(value => value / norm) : vector;
  }
}
module.exports = { MockEmbeddingProvider };
