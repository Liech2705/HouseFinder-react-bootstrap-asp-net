using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyApi.Application.DTOs.CheckBookingDtos;
using MyApi.Application.DTOs.HouseImageDtos;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Repositories;

namespace MyApi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HouseImagesController : ControllerBase
    {
        private readonly IHouseImageRepository _houseImageRepository;
        private readonly IMapper _mapper;

        public HouseImagesController(IHouseImageRepository houseImageRepository, IMapper mapper)
        {
            _houseImageRepository = houseImageRepository;
            _mapper = mapper;
        }

        // GET: api/HouseImages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HouseImageReadDto>>> GetAll()
        {
            var images = await _houseImageRepository.GetAllAsync<HouseImageReadDto>(_mapper.ConfigurationProvider);
            var imagesDto = _mapper.Map<IEnumerable<HouseImageReadDto>>(images);
            return Ok(imagesDto);
        }

        // GET: api/HouseImages/5
        [HttpGet("{id}")]
        public async Task<ActionResult<HouseImageReadDto>> GetById(int id)
        {
            var image = await _houseImageRepository.GetByIdAsync(id);
            if (image == null) return NotFound();

            var imageDto = _mapper.Map<HouseImageReadDto>(image);
            return Ok(imageDto);
        }

        // GET: api/HouseImages/house/5
        [HttpGet("house/{houseId}")]
        public async Task<ActionResult<IEnumerable<HouseImageReadDto>>> GetByHouseId(int houseId)
        {
            var images = await _houseImageRepository.GetByHouseIdAsync(houseId);
            var imagesDto = _mapper.Map<IEnumerable<HouseImageReadDto>>(images);
            return Ok(imagesDto);
        }

        // POST: api/HouseImages
        [HttpPost]
        public async Task<ActionResult<HouseImageReadDto>> Create(HouseImageCreateDto createDto)
        {
            var image = _mapper.Map<HouseImage>(createDto);

            await _houseImageRepository.AddAsync(image);
            await _houseImageRepository.SaveChangesAsync();

            var imageDto = _mapper.Map<HouseImageReadDto>(image);
            return CreatedAtAction(nameof(GetById), new { id = image.House_Image_Id }, imageDto);
        }

        // PUT: api/HouseImages/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, HouseImageUpdateDto updateDto)
        {
            var image = await _houseImageRepository.GetByIdAsync(id);
            if (image == null) return NotFound();

            _mapper.Map(updateDto, image);

            _houseImageRepository.Update(image);
            await _houseImageRepository.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/HouseImages/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var image = await _houseImageRepository.GetByIdAsync(id);
            if (image == null) return NotFound();

            _houseImageRepository.Remove(image);
            await _houseImageRepository.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{id}/images/upload")]
        public async Task ChangeImagesRoom(int id, [FromForm] IFormFileCollection imageHouses)
        {
            await _houseImageRepository.ChangeImagesHouse(id, imageHouses);
        }
    }
}
