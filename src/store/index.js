// Store assembly point for application services. Services use this module rather
// than depending directly on the in-memory implementation.
const { vectorStore } = require('./InMemoryVectorStore');
module.exports = { vectorStore };
