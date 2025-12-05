using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyApi.Application.DTOs.NotificationDtos;
using MyApi.Application.DTOs.PaymentDtos;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;

namespace MyApi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly IMapper _mapper;

        public PaymentsController(IPaymentRepository paymentRepository, IMapper mapper)
        {
            _paymentRepository = paymentRepository;
            _mapper = mapper;
        }

        // GET: api/Payments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymentReadDto>>> GetAll()
        {
            var payments = await _paymentRepository.GetAllAsync<PaymentReadDto>(_mapper.ConfigurationProvider);
            var paymentsDto = _mapper.Map<IEnumerable<PaymentReadDto>>(payments);
            return Ok(paymentsDto);
        }

        // GET: api/Payments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentReadDto>> GetById(int id)
        {
            var payment = await _paymentRepository.GetByIdAsync(id);
            if (payment == null) return NotFound();

            var paymentDto = _mapper.Map<PaymentReadDto>(payment);
            return Ok(paymentDto);
        }

        // GET: api/Payments/booking/5
        //[HttpGet("booking/{bookingId}")]
        //public async Task<ActionResult<IEnumerable<PaymentReadDto>>> GetByBookingId(int bookingId)
        //{
        //    var payments = await _paymentRepository.GetByBookingIdAsync(bookingId);
        //    var paymentsDto = _mapper.Map<IEnumerable<PaymentReadDto>>(payments);
        //    return Ok(paymentsDto);
        //}

        //// GET: api/Payments/method/5
        //[HttpGet("method/{methodId}")]
        //public async Task<ActionResult<IEnumerable<PaymentReadDto>>> GetByMethodId(int methodId)
        //{
        //    var payments = await _paymentRepository.GetByMethodIdAsync(methodId);
        //    var paymentsDto = _mapper.Map<IEnumerable<PaymentReadDto>>(payments);
        //    return Ok(paymentsDto);
        //}

        // POST: api/Payments
        [HttpPost]
        public async Task<ActionResult<PaymentReadDto>> Create(PaymentCreateDto createDto)
        {
            var payment = _mapper.Map<Payment>(createDto);

            await _paymentRepository.AddAsync(payment);
            await _paymentRepository.SaveChangesAsync();

            var paymentDto = _mapper.Map<PaymentReadDto>(payment);
            return CreatedAtAction(nameof(GetById), new { id = payment.Payment_Id }, paymentDto);
        }

        // PUT: api/Payments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, PaymentUpdateDto updateDto)
        {
            var payment = await _paymentRepository.GetByIdAsync(id);
            if (payment == null) return NotFound();

            _mapper.Map(updateDto, payment);

            _paymentRepository.Update(payment);
            await _paymentRepository.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Payments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var payment = await _paymentRepository.GetByIdAsync(id);
            if (payment == null) return NotFound();

            _paymentRepository.Remove(payment);
            await _paymentRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
