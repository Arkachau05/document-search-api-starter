const request = require('supertest');
const app = require('../src/app');
const { vectorStore } = require('../src/store/InMemoryVectorStore');
beforeEach(() => vectorStore.clear());
describe('search endpoint', () => {
  test('rejects blank query and out-of-range topK', async () => {
    expect((await request(app).post('/v1/search').send({ query: ' ' })).status).toBe(400);
    expect((await request(app).post('/v1/search').send({ query: 'cache', topK: 21 })).status).toBe(400);
  });
  test('returns results and applies metadata filters (complete TODOs first)', async () => {
    await request(app).post('/v1/documents').send({ title: 'Caching', content: 'Caching reduces latency.', metadata: { topic: 'backend' } });
    await request(app).post('/v1/documents').send({ title: 'Gardening', content: 'Water plants and prepare soil.', metadata: { topic: 'hobby' } });
    const res = await request(app).post('/v1/search').send({ query: 'reduce latency using cache', filters: { topic: 'backend' } });
    expect(res.status).toBe(200);
    expect(res.body.results.length).toBeGreaterThan(0);
    expect(res.body.results.every(item => item.title === 'Caching')).toBe(true);
  });
});
