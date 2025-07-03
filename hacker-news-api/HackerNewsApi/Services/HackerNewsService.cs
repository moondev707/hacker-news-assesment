using HackerNewsApi.Models;
using Microsoft.Extensions.Caching.Memory;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace HackerNewsApi.Services
{
    public class HackerNewsService : IHackerNewsService
    {
        private readonly IMemoryCache _cache;
        private readonly IHttpClientFactory _httpClientFactory;
        private const string NewStoriesCacheKey = "newstories";
        private const int CacheDurationSeconds = 60;

        public HackerNewsService(IMemoryCache cache, IHttpClientFactory httpClientFactory)
        {
            _cache = cache;
            _httpClientFactory = httpClientFactory;
        }

        private async Task<StoryDto> GetStoryById(int id)
        {
            StoryDto story;
            if (!_cache.TryGetValue(NewStoriesCacheKey, out story))
            {
                var client = _httpClientFactory.CreateClient();
                var storyResponse = await client.GetStringAsync($"https://hacker-news.firebaseio.com/v0/item/{id}.json");
                using var doc = JsonDocument.Parse(storyResponse);
                var root = doc.RootElement;

                var title = root.GetProperty("title").GetString();
                var url = root.TryGetProperty("url", out var urlProp) ? urlProp.GetString() : null;

                story = new StoryDto
                {
                    Id = id,
                    Title = title,
                    Url = url
                };
                _cache.Set($"{NewStoriesCacheKey}__${id}", story, TimeSpan.FromSeconds(CacheDurationSeconds));
            }
            return story;
        }

        public async Task<List<StoryDto>> GetNewestStoriesAsync(int page, int pageSize, string search = null)
        {
            var client = _httpClientFactory.CreateClient();
            List<int> storyIds;

            if (!_cache.TryGetValue(NewStoriesCacheKey, out storyIds))
            {
                var idsResponse = await client.GetStringAsync("https://hacker-news.firebaseio.com/v0/newstories.json");
                storyIds = JsonSerializer.Deserialize<List<int>>(idsResponse);
                _cache.Set(NewStoriesCacheKey, storyIds, TimeSpan.FromSeconds(CacheDurationSeconds));
            }

            var pagedIds = storyIds.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            // PARALLEL: Fire off all requests at once
            var tasks = pagedIds.Select(id => GetStoryById(id)).ToList();
            var stories = (await Task.WhenAll(tasks)).ToList();

            if (!string.IsNullOrEmpty(search))
            {
                stories = stories.Where(s => s.Title != null && s.Title.Contains(search, StringComparison.OrdinalIgnoreCase)).ToList();
            }

            return stories;
        }
    }
}