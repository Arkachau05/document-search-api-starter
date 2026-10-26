const express = require('express');
const { searchDocuments } = require('../services/searchService');
const { searchSchema } = require('../validation/schemas');
const router = express.Router();
router.post('/', async (req, res, next) => {
  try {
    // TODO: map schema validation errors to a safe HTTP 400 response.
    const input = searchSchema.parse(req.body);
    res.status(200).json({ results: await searchDocuments(input) });
  } catch (err) { next(err); }
});
module.exports = router;
