using Google.GenAI;
using Google.GenAI.Types;
using Microsoft.AspNetCore.Mvc;
namespace MyApi.Api.Controllers
{
    [ApiController]
    [Route("api/debug")]
    public class GeminiDebugController : ControllerBase
    {
        private readonly Client _client;
        public GeminiDebugController(Client client)
        {
            _client = client;
        }

        [HttpGet("gemini-models")]
        public async Task<IActionResult> ListModels()
        {
            try
            {
                // BƯỚC 1: Thêm 'await' để lấy đối tượng Pager thực sự từ Task
                // Lỗi trong ảnh 2 là do thiếu await ở dòng này
                var pager = await _client.Models.ListAsync();

                var allModels = new List<Model>();

                // BƯỚC 2: Duyệt qua Pager để đổ dữ liệu vào List
                // Lỗi trong ảnh 3 là do cố dùng .Select() trực tiếp trên pager
                await foreach (var model in pager)
                {
                    allModels.Add(model);
                }

                // BƯỚC 3: Bây giờ allModels là List<Model> bình thường, bạn dùng LINQ thoải mái
                var availableModels = allModels
                    // .Where(m => m.SupportedGenerationMethods.Contains("generateContent")) // Tùy chọn lọc
                    .Select(m => new
                    {
                        Id = m.Name,
                        DisplayName = m.DisplayName,
                        Version = m.Version,
                        Description = m.Description
                    })
                    .OrderBy(m => m.Id)
                    .ToList();

                return Ok(new
                {
                    Count = availableModels.Count,
                    Models = availableModels
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
    }
}
