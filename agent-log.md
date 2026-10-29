<!-- Development notes for AI-assisted implementation work in this repository. -->
# AI Agent Log

## Project goal
Build and document a Node.js/Express Document Search API that accepts documents, splits them into chunks, creates embeddings with an `EmbeddingProvider`, stores them in memory, retrieves documents by ID, and ranks search results with cosine similarity.

The implementation follows the API contract in `README.md` and the constraints in that file: Node.js 20+, in-memory storage, no external embedding API, database, vector database, secrets, or production semantic model.

## Problem framing
Document ingestion and semantic search are kept as separate application use cases:
- Document ingestion validates input, creates IDs, chunks text, embeds chunks, saves records, and returns a small creation summary.
- Document retrieval loads only the public document summary by ID.
- Search embeds the query, filters chunks through their owning document metadata, calculates similarity, sorts results, and limits them to `topK`.

Assumptions and constraints:
- The starter application intentionally began with TODO implementations.
- The mock embedding provider is deterministic and suitable for offline development and tests.
- Storage lasts only for the life of the Node.js process.
- HTTP concerns remain in routes and application middleware; domain behavior remains in services and supporting modules.

## Conversation and implementation summary
### 1. Codebase comments and documentation
The initial request was to analyze the existing codebase and add meaningful comments without changing application logic. Comments were added to source modules and tests, and `README.md` received a beginner-friendly codebase guide. The agent did not alter executable behavior while completing this documentation task.

### 2. Document ingestion implementation
The next request was to implement the ingest requirement:
1. Validate the request with Zod.
2. Generate a document ID and chunk IDs.
3. Split document text.
4. Embed each chunk using `EmbeddingProvider`.
5. Persist document metadata and chunk vectors.
6. Return only `{ id, title, chunkCount }` from `POST /v1/documents`.

The API retrieval contract was implemented for `GET /v1/documents/:id`. Missing documents return the required `404` envelope, and internal failures use a safe generic response instead of exposing exceptions.

### 3. Chunking
A pure `chunkText(text, maxSize = 500, overlap = 100)` function was implemented. It:
- Returns `[]` for blank or whitespace-only text.
- Returns one chunk for short text.
- Uses 500-character chunks by default.
- Reuses 100 characters of the previous chunk in the next chunk.
- Produces no empty chunks.
- Does not mutate or require HTTP-specific input.

### 4. Search implementation
Search now:
- Embeds the query through the configured provider.
- Applies all requested metadata filter entries.
- Calculates cosine similarity without an external vector-search library.
- Sorts by descending similarity with a stable chunk ID tie-breaker.
- Limits returned results to `topK`.
- Returns the documented fields: `documentId`, `title`, `chunkId`, `content`, and `score`.

### 5. Architecture verification and abstraction changes
The chunking module was verified to be independent of Express and storage.

Provider abstraction remains layered as:
```text
services → providers/index.js → MockEmbeddingProvider → EmbeddingProvider
```

Storage abstraction was added as:
```text
services → store/index.js → InMemoryVectorStore → VectorStore
```

This allows services to depend on the store contract without requiring direct knowledge of maps, databases, or external vector services. The concrete implementation retains process-local `Map` storage and the deterministic mock provider remains the default provider.

### 6. Validation and safe errors
The Zod schemas validate:
- Document title and content as non-empty strings after trimming.
- Metadata and search filters as objects.
- Search query as a non-empty string after trimming.
- `topK` as an integer in the range 1–20.

Shared error middleware maps malformed JSON, oversized JSON, and Zod validation failures to:
```json
{"error":{"code":"VALIDATION_ERROR","message":"The request payload is invalid."}}
```
Document lookup uses `DOCUMENT_NOT_FOUND` with `404`. Unknown routes use `NOT_FOUND`. Unexpected failures use a generic `500` response without stack traces or internal messages.

### 7. Tests
Test coverage was expanded for:
- Health check.
- Document validation, ingest, retrieval, malformed JSON, and missing IDs.
- Search validation, metadata filters, ranking, and result limits.
- Chunk size, overlap, exact 500-character content, blank content, and input immutability.
- Invalid metadata types and invalid query/topK/filter values.

The TODO-only test descriptions were also updated to describe actual completed behavior.

## Files/modules modified
- `README.md`: API documentation, codebase guide, and completed requirement checklist.
- `src/app.js`: application comments, middleware, route mounting, and JSON body handling documentation.
- `src/server.js`: runtime entry point documentation.
- `src/chunking/chunkText.js`: pure chunking implementation.
- `src/middleware/errorHandler.js`: safe validation and internal error handling.
- `src/providers/EmbeddingProvider.js`: provider contract documentation.
- `src/providers/MockEmbeddingProvider.js`: deterministic mock embedding implementation documentation.
- `src/providers/index.js`: provider assembly and mock-provider selection.
- `src/routes/documents.js`: document request and response handling documentation.
- `src/routes/search.js`: search request handling documentation.
- `src/services/documentService.js`: ingestion, chunk embedding, persistence, and document lookup implementation.
- `src/services/searchService.js`: query embedding, filtering, cosine similarity, sorting, and result limiting.
- `src/store/VectorStore.js`: storage abstraction added.
- `src/store/InMemoryVectorStore.js`: concrete in-memory store implementing the abstraction.
- `src/store/index.js`: store assembly point added.
- `src/validation/schemas.js`: request schemas documented.
- `tests/chunkText.test.js`: chunking and edge-case tests.
- `tests/documents.test.js`: document endpoint and malformed-request tests.
- `tests/health.test.js`: health endpoint documentation and coverage.
- `tests/search.test.js`: search and metadata-filter tests.
- `tests/validation.test.js`: metadata, query, topK, and filter validation coverage added.

## Verification results
### Automated tests
Final verification ran:
```text
npm test
```

Result:
```text
Test Suites: 5 passed, 5 total
Tests:       25 passed, 25 total
```

### Runtime API verification
The server was started and tested with the API contract payloads.

Verified behavior included:
- `GET /health` returns `{ "status": "ok" }` with HTTP 200.
- `POST /v1/documents` creates a document and returns HTTP 201 with an ID and chunk count.
- `GET /v1/documents/:id` returns the created document summary with HTTP 200.
- Missing document IDs return HTTP 404.
- `POST /v1/search` returns ranked matching chunks with HTTP 200.
- Metadata filtering excludes documents with other metadata values.
- Malformed JSON returns HTTP 400 with the standard `VALIDATION_ERROR` envelope.
- A 501-character document produced two chunks, confirming overlap behavior.

### Abstraction checks
A runtime Node.js check confirmed:
- `MockEmbeddingProvider instanceof EmbeddingProvider` is true.
- `InMemoryVectorStore instanceof VectorStore` is true.

No remaining TODO implementation markers were found in the JavaScript or Markdown project files after implementation.

## Design decisions
- Used UUIDs prefixed with `doc_` and `chunk_` for process-friendly unique identifiers.
- Used 500/100 defaults for chunk size/overlap as required by the API contract.
- Kept chunk text content in the returned search result so clients receive retrievable context.
- Applied metadata filters by exact key/value equality.
- Used a deterministic local hash-based embedding so tests and development remain offline.
- Used an equal-dimensional cosine implementation and return `0` for a zero vector.
- Sorted equal cosine scores by chunk ID to make ties deterministic.
- Returned copies from the in-memory store so callers cannot directly mutate stored objects.

## Known limitations
- Data disappears when the server restarts because storage is intentionally in-memory.
- The mock embedding provider is not a production semantic model and understands token overlap, not deep language meaning.
- Chunk boundaries are character-based; text is not split by sentences or paragraphs.
- No authentication, authorization, persistence, cache, rate limiting, or external embedding service is included.
- Cosine similarity is calculated locally rather than delegated to a vector database.
- UUID generation and deterministic mock embeddings are sufficient for this starter API but are not distributed-system guarantees.
