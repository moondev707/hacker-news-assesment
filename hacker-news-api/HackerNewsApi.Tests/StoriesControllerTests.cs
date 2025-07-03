using Xunit;
using Moq;
using Microsoft.Extensions.Caching.Memory;
using System.Net.Http;
using HackerNewsApi.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using HackerNewsApi.Controllers;
using HackerNewsApi.Models;

namespace HackerNewsApi.Tests
{
    public class HackerNewsServiceTests
    {
        [Fact]
        public void Service_Can_Be_Constructed()
        {
            var memoryCache = new MemoryCache(new MemoryCacheOptions());
            var httpClientFactory = new Mock<IHttpClientFactory>().Object;

            var service = new HackerNewsService(memoryCache, httpClientFactory);

            Assert.NotNull(service);
        }
    }

    public class StoriesControllerTests
    {
        [Fact]
        public async Task GetNewest_ReturnsOkResult_WithStoriesList()
        {
            // Arrange
            var mockService = new Mock<IHackerNewsService>();
            var expectedStories = new List<StoryDto>
            {
                new StoryDto { Id = 1, Title = "Story 1", Url = "http://story1.com" },
                new StoryDto { Id = 2, Title = "Story 2", Url = null }
            };
            mockService.Setup(s => s.GetNewestStoriesAsync(1, 20, null)).ReturnsAsync(expectedStories);
            var controller = new StoriesController(mockService.Object);

            // Act
            var result = await controller.GetNewest();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var stories = Assert.IsType<List<StoryDto>>(okResult.Value);
            Assert.Equal(2, stories.Count);
            Assert.Equal("Story 1", stories[0].Title);
            Assert.Null(stories[1].Url);
        }
    }
}