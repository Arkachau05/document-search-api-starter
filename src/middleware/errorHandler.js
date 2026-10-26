function notFoundHandler(_req, res) {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found.' } });
}
function errorHandler(error, _req, res, _next) {
  // TODO: map validation/application errors to stable safe responses.
  // Never send stack traces or raw provider/internal messages to clients.
  console.error(error);
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' } });
}
module.exports = { notFoundHandler, errorHandler };
