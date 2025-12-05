using MyApi.Application.DTOs.BookingDtos;


namespace MyApi.Infrastructure.Services
{
    public class VnPayService : IVnPayService
    {
        private readonly IConfiguration _configuration;
        private readonly VNPayLibrary _vnPayLibrary;

        public VnPayService(IConfiguration configuration, VNPayLibrary vnPayLibrary)
        {
            _configuration = configuration;
            _vnPayLibrary = vnPayLibrary;
        }

        public string CreatePaymentUrl(VNPayRequest model, HttpContext context)
        {
            var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(_configuration["TimeZoneId"]);
            var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);
            var urlCallBack = _configuration["VNPay:PaymentBackReturnUrl"];

            _vnPayLibrary.AddRequestData("vnp_Version", _configuration["Vnpay:Version"]);
            _vnPayLibrary.AddRequestData("vnp_Command", _configuration["Vnpay:Command"]);
            _vnPayLibrary.AddRequestData("vnp_TmnCode", _configuration["Vnpay:TmnCode"]);
            _vnPayLibrary.AddRequestData("vnp_Amount", ((int)model.Amount * 100).ToString());
            _vnPayLibrary.AddRequestData("vnp_CreateDate", timeNow.ToString("yyyyMMddHHmmss"));
            _vnPayLibrary.AddRequestData("vnp_CurrCode", _configuration["Vnpay:CurrCode"]);
            _vnPayLibrary.AddRequestData("vnp_IpAddr", _vnPayLibrary.GetIpAddress(context));
            _vnPayLibrary.AddRequestData("vnp_Locale", _configuration["Vnpay:Locale"]);
            _vnPayLibrary.AddRequestData("vnp_OrderInfo", $"{model.RoomId} {model.Amount}");
            _vnPayLibrary.AddRequestData("vnp_OrderType", model.Payment_Method);
            _vnPayLibrary.AddRequestData("vnp_ReturnUrl", urlCallBack);
            _vnPayLibrary.AddRequestData("vnp_TxnRef", model.BookingId.ToString());

            var paymentUrl =
                _vnPayLibrary.CreateRequestUrl(_configuration["Vnpay:BaseUrl"], _configuration["Vnpay:HashSecret"]);

            return paymentUrl;
        }


        public VnPayResponse PaymentExecute(IQueryCollection collections)
        {
            var response = _vnPayLibrary.GetFullResponseData(collections, _configuration["Vnpay:HashSecret"]);

            return response;
        }


    }
}
