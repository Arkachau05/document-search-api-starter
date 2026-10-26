const { z } = require('zod');
const ingestDocumentSchema = z.object({
  title: z.string().trim().min(1),
  content: z.string().trim().min(1),
  metadata: z.record(z.unknown()).optional()
});
const searchSchema = z.object({
  query: z.string().trim().min(1),
  topK: z.number().int().min(1).max(20).optional(),
  filters: z.record(z.unknown()).optional()
});
module.exports = { ingestDocumentSchema, searchSchema };
