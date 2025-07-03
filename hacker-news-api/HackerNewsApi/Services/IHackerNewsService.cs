using HackerNewsApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HackerNewsApi.Services
{
    public interface IHackerNewsService
    {
        Task<List<StoryDto>> GetNewestStoriesAsync(int page, int pageSize, string search = null);
    }
}