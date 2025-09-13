using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyApi.Application.DTOs.ReportDtos;
using MyApi.Domain.Entities;
using MyApi.Domain.Enums;
using MyApi.Domain.Interfaces;

namespace MyApi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly IReportRepository _reportRepository;
        private readonly IMapper _mapper;

        public ReportsController(IReportRepository reportRepository, IMapper mapper)
        {
            _reportRepository = reportRepository;
            _mapper = mapper;
        }

        // GET: api/Reports
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReportReadDto>>> GetAll()
        {
            var reports = await _reportRepository.GetAllAsync();
            return Ok(_mapper.Map<IEnumerable<ReportReadDto>>(reports));
        }

        // GET: api/Reports/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ReportReadDto>> GetById(int id)
        {
            var report = await _reportRepository.GetByIdAsync(id);
            if (report == null) return NotFound();

            return Ok(_mapper.Map<ReportReadDto>(report));
        }

        // GET: api/Reports/reporter/5
        [HttpGet("reporter/{reporterId}")]
        public async Task<ActionResult<IEnumerable<ReportReadDto>>> GetByReporter(int reporterId)
        {
            var reports = await _reportRepository.GetByReporterIdAsync(reporterId);
            return Ok(_mapper.Map<IEnumerable<ReportReadDto>>(reports));
        }

        // GET: api/Reports/reported/5
        [HttpGet("reported/{reportedId}")]
        public async Task<ActionResult<IEnumerable<ReportReadDto>>> GetByReported(int reportedId)
        {
            var reports = await _reportRepository.GetByReportedIdAsync(reportedId);
            return Ok(_mapper.Map<IEnumerable<ReportReadDto>>(reports));
        }

        // GET: api/Reports/status/Pending
        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<ReportReadDto>>> GetByStatus(ReportStatus status)
        {
            var reports = await _reportRepository.GetByStatusAsync(status);
            return Ok(_mapper.Map<IEnumerable<ReportReadDto>>(reports));
        }

        // GET: api/Reports/type/Spam
        [HttpGet("type/{type}")]
        public async Task<ActionResult<IEnumerable<ReportReadDto>>> GetByType(ReportType type)
        {
            var reports = await _reportRepository.GetByTypeAsync(type);
            return Ok(_mapper.Map<IEnumerable<ReportReadDto>>(reports));
        }

        // POST: api/Reports
        [HttpPost]
        public async Task<ActionResult<ReportReadDto>> Create(ReportCreateDto createDto)
        {
            var report = _mapper.Map<Report>(createDto);
            await _reportRepository.AddAsync(report);
            await _reportRepository.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = report.Report_Id }, _mapper.Map<ReportReadDto>(report));
        }

        // PUT: api/Reports/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ReportUpdateDto updateDto)
        {
            var report = await _reportRepository.GetByIdAsync(id);
            if (report == null) return NotFound();

            _mapper.Map(updateDto, report);
            _reportRepository.Update(report);
            await _reportRepository.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Reports/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var report = await _reportRepository.GetByIdAsync(id);
            if (report == null) return NotFound();

            _reportRepository.Remove(report);
            await _reportRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
