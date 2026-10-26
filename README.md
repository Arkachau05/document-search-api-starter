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
- [ ] Keep chunking pure and separate from HTTP.
- [ ] Keep provider and in-memory store behind abstractions; retain mock provider.
- [ ] Validate metadata, query, and topK; return consistent safe errors.
- [ ] Add tests for ingest/search/chunking/validation/filters and edge cases.
- [ ] Complete root `agent-log.md`.

## Suggested layers
`routes → services → chunking/providers/store`, plus validation and error middleware.

Constraints: Node.js 20+, in-memory storage only, no external embedding API/DB/vector DB, offline after `npm install`, no hardcoded secrets. This is starter code; TODOs are intentional.
