// HTTP endpoint for semantic search requests; it validates the payload before invoking the search service.
const express = require('express');
const { searchDocuments } = require('../services/searchService');
const { searchSchema } = require('../validation/schemas');
const router = express.Router();
router.post('/', async (req, res, next) => {
  try {
    // Validation supplies safe defaults and bounds before ranking is requested.
    const input = searchSchema.parse(req.body);
    res.status(200).json({ results: await searchDocuments(input) });
  } catch (err) { next(err); }
});
module.exports = router;
