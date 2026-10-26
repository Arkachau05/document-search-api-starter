const { MockEmbeddingProvider } = require('./MockEmbeddingProvider');
// TODO: keep provider selection/configuration here, not inside services/routes.
const embeddingProvider = new MockEmbeddingProvider();
module.exports = { embeddingProvider };
