// Central HTTP error handling keeps malformed requests and internal failures from leaking implementation details.
const { ZodError } = require('zod');
function notFoundHandler(_req, res) {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found.' } });
}
function errorHandler(error, _req, res, _next) {
  if (
    error instanceof ZodError ||
    error.type === 'entity.parse.failed' ||
    error.type === 'entity.too.large'
  ) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'The request payload is invalid.' }
    });
  }
  console.error(error);
  return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' } });
}
module.exports = { notFoundHandler, errorHandler };
