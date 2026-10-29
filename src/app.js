// Application composition: configures Express, mounts the API route modules, and installs shared handlers.
const express = require('express');
const documents = require('./routes/documents');
const search = require('./routes/search');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const app = express();
// Limit JSON request bodies and make parsed properties available as req.body.
app.use(express.json({ limit: '1mb' }));
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
// Mount domain routers after body parsing and before shared error middleware.
app.use('/v1/documents', documents);
app.use('/v1/search', search);
app.use(notFoundHandler);
app.use(errorHandler);
module.exports = app;
