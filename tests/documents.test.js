const request = require('supertest');
const app = require('../src/app');
const { vectorStore } = require('../src/store/InMemoryVectorStore');
beforeEach(() => vectorStore.clear());
describe('document endpoints', () => {
  test('rejects empty title/content with 400', async () => {
    const res = await request(app).post('/v1/documents').send({ title: ' ', content: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
  test('ingests and retrieves a document (complete TODOs first)', async () => {
    const created = await request(app).post('/v1/documents').send({ title: 'Caching', content: 'Caching reduces latency.' });
    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({ title: 'Caching', chunkCount: 1 });
    const fetched = await request(app).get(`/v1/documents/${created.body.id}`);
    expect(fetched.status).toBe(200);
  });
  test('missing document returns 404', async () => {
    expect((await request(app).get('/v1/documents/missing')).status).toBe(404);
  });
});
