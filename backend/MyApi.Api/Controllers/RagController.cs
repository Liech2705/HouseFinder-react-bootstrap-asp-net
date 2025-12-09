using Microsoft.AspNetCore.Mvc;
using MyApi.Api.Services.RAG.Index;

namespace MyApi.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RagController : ControllerBase
    {
        private readonly HouseIndexer _rag;
        public RagController(HouseIndexer rag) => _rag = rag;

        [HttpPost("index")]
        public async Task<IActionResult> IndexAll()
        {
            await _rag.IndexAllAsync();
            return Ok(new { message = "Indexed to Qdrant." });
        }

    }
}
