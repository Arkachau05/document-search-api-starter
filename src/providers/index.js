// Provider assembly point. Services depend on the exported provider rather than a concrete provider module.
const { MockEmbeddingProvider } = require('./MockEmbeddingProvider');
// TODO: keep provider selection/configuration here, not inside services/routes.
const embeddingProvider = new MockEmbeddingProvider();
module.exports = { embeddingProvider };
