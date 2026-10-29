# Build a Document Search API

Medium · Node.js 20+ · Express · RAG retrieval

Build a retrieval API, not a chatbot: `Document → Chunking → Embeddings → Vector Search → Relevant Context`.

## Run
```bash
npm install
npm test
npm run dev
```
Server defaults to `http://localhost:3000`. The mock embedding provider is deterministic and works offline; no API key or database is required.

## API contract

### `POST /v1/documents` — 201
Request:
```json
{"title":"Caching Basics","content":"A cache stores frequently accessed data...","metadata":{"topic":"backend"}}
```
`title` and `content` must be non-empty strings. `metadata` is optional and must be an object.
Response: `{"id":"doc_...","title":"Caching Basics","chunkCount":1}`

### `GET /v1/documents/:id` — 200
Returns `{"id":"doc_...","title":"Caching Basics","chunkCount":1}`; missing documents return 404.

### `POST /v1/search` — 200
Request:
```json
{"query":"How does caching reduce latency?","topK":5,"filters":{"topic":"backend"}}
```
`query` is required and non-empty. `topK` is optional, integer 1–20, default 5. `filters` is an optional metadata object. Results are sorted by cosine similarity descending:
```json
{"results":[{"documentId":"doc_...","title":"Caching Basics","chunkId":"chunk_...","content":"...","score":0.87}]}
```

Errors must use `{"error":{"code":"VALIDATION_ERROR","message":"The request payload is invalid."}}`. Use 400 for invalid input and 404 for missing documents. Never expose stack traces or internals.

## Requirements
- [ ] Ingest: validate, generate ID, chunk, embed through `EmbeddingProvider`, persist document and chunks.
- [ ] Fetch document by ID.
- [ ] Search: embed query, apply metadata filters, calculate cosine similarity yourself, sort descending, return top-K.
- [ ] Chunk max 500 characters with 100-character overlap; no empty chunks; short text is one chunk.
- [x] Keep chunking pure and separate from HTTP.
- [x] Keep provider and in-memory store behind abstractions; retain mock provider.
- [x] Validate metadata, query, and topK; return consistent safe errors.
- [x] Add tests for ingest/search/chunking/validation/filters and edge cases.
- [x] Complete root `agent-log.md`.

## Suggested layers
`routes → services → chunking/providers/store`, plus validation and error middleware.

Constraints: Node.js 20+, in-memory storage only, no external embedding API/DB/vector DB, offline after `npm install`, no hardcoded secrets. This is starter code; TODOs are intentional.

## Codebase guide
- `package.json`: declares runtime dependencies, Node.js compatibility, and the start/test scripts.
- `src/app.js`: assembles the Express application, middleware, health endpoint, and API routers.
- `src/server.js`: process entry point that reads the configured port and starts listening.
- `src/chunking/chunkText.js`: pure text-splitting utility for preparing document chunks.
- `src/middleware/errorHandler.js`: converts unmatched routes and application errors into safe API responses.
- `src/providers/EmbeddingProvider.js`: base interface that all embedding implementations follow.
- `src/providers/MockEmbeddingProvider.js`: deterministic offline embedding implementation for development and tests.
- `src/providers/index.js`: provider construction and dependency assembly for service modules.
- `src/routes/documents.js`: validates and transports document ingest/fetch HTTP requests.
- `src/routes/search.js`: validates and transports semantic search HTTP requests.
- `src/services/documentService.js`: coordinates document IDs, chunking, embeddings, and storage.
- `src/services/searchService.js`: coordinates query embedding, filtering, cosine scoring, and ranking.
- `src/store/VectorStore.js`: storage interface used by services so persistence implementations can be replaced.
- `src/store/InMemoryVectorStore.js`: process-local implementation of the store contract using maps.
- `src/store/index.js`: store assembly point shared by services and tests.
- `src/validation/schemas.js`: Zod schemas defining accepted request fields and value constraints.
- `tests/`: HTTP, chunking, validation, filtering, and health-check behavior verification.
- `agent-log.md`: development record template for documenting implementation and verification decisions.
