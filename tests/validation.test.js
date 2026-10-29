// Request-contract coverage for metadata objects, search values, and safe error envelopes.
const request = require('supertest');
const app = require('../src/app');
const { vectorStore } = require('../src/store');

const validationError = {
  error: { code: 'VALIDATION_ERROR', message: 'The request payload is invalid.' }
};

beforeEach(() => vectorStore.clear());

describe('request validation', () => {
  test.each([
    { title: 'Valid title', content: 'Valid content', metadata: [] },
    { title: 'Valid title', content: 'Valid content', metadata: null },
    { title: 123, content: 'Valid content' },
    { title: 'Valid title', content: false }
  ])('rejects invalid document payload %#', async payload => {
    const response = await request(app).post('/v1/documents').send(payload);
    expect(response.status).toBe(400);
    expect(response.body).toEqual(validationError);
  });

  test('accepts an optional metadata object', async () => {
    const response = await request(app).post('/v1/documents').send({
      title: 'Document',
      content: 'Document content.',
      metadata: { topic: 'backend', published: true }
    });
    expect(response.status).toBe(201);
  });

  test.each([
    { query: '' },
    { query: '   ' },
    { query: 42 },
    { query: 'cache', topK: 0 },
    { query: 'cache', topK: 21 },
    { query: 'cache', topK: 1.5 },
    { query: 'cache', topK: '5' },
    { query: 'cache', filters: [] }
  ])('rejects invalid search payload %#', async payload => {
    const response = await request(app).post('/v1/search').send(payload);
    expect(response.status).toBe(400);
    expect(response.body).toEqual(validationError);
  });
});
