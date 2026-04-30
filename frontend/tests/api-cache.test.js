import {
  fetchFaq,
  fetchTimeline,
  __clearApiCacheForTests,
} from '../utils/api';

describe('api cache', () => {
  beforeEach(() => {
    __clearApiCacheForTests();
    global.fetch = vi.fn();
  });

  it('reuses cached faq response', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ items: [{ question: 'Q', answer: 'A' }] }),
    });

    const first = await fetchFaq();
    const second = await fetchFaq();

    expect(first.items.length).toBe(1);
    expect(second.items.length).toBe(1);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('caches by timeline region key', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ items: [] }),
    });

    await fetchTimeline('national');
    await fetchTimeline('national');
    await fetchTimeline('rajasthan');

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
