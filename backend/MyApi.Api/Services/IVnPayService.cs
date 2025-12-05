using Microsoft.AspNetCore.Http;
using MyApi.Application.DTOs.BookingDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyApi.Infrastructure.Services
{
    public interface IVnPayService
    {
        string CreatePaymentUrl(VNPayRequest model, HttpContext context);
        VnPayResponse PaymentExecute(IQueryCollection collections);

    }
}
