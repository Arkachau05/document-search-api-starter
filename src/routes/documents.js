const express = require('express');
const { ingestDocument, getDocument } = require('../services/documentService');
const { ingestDocumentSchema } = require('../validation/schemas');
const router = express.Router();
router.post('/', async (req, res, next) => {
  try {
    // TODO: map schema validation errors to a safe HTTP 400 response.
    const input = ingestDocumentSchema.parse(req.body);
    res.status(201).json(await ingestDocument(input));
  } catch (err) { next(err); }
});
router.get('/:id', (req, res, next) => {
  try {
    const doc = getDocument(req.params.id);
    if (!doc) return res.status(404).json({ error: { code: 'DOCUMENT_NOT_FOUND', message: 'Document not found.' } });
    return res.status(200).json(doc);
  } catch (err) { return next(err); }
});
module.exports = router;
