using Microsoft.Extensions.Logging;
using MyApi.Application.DTOs.BookingDtos;
using System.Globalization;
using System.Net;
using System.Net.Sockets;
using System.Security.Cryptography;
using System.Text;

public class VNPayLibrary
{
    private readonly SortedList<string, string> _requestData = new SortedList<string, string>(new VnPayCompare());
    private readonly SortedList<string, string> _responseData = new SortedList<string, string>(new VnPayCompare());
    private readonly ILogger<VNPayLibrary> _logger;

    public VNPayLibrary(ILogger<VNPayLibrary> logger)
    {
        _logger = logger;
    }

    public VnPayResponse GetFullResponseData(IQueryCollection collection, string hashSecret)
    {
        foreach (var (key, value) in collection)
        {
            if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
            {
                AddResponseData(key, value);
            }
        }
        var orderId = Convert.ToInt16(GetResponseData("vnp_TxnRef"));
        var vnPayTranId = Convert.ToInt64(GetResponseData("vnp_TransactionNo"));
        var amount = Convert.ToInt64(GetResponseData("vnp_Amount"));
        var vnpResponseCode = GetResponseData("vnp_ResponseCode");
        var vnpSecureHash =
            collection.FirstOrDefault(k => k.Key == "vnp_SecureHash").Value; //hash của dữ liệu trả về
        var checkSignature =
            ValidateSignature(vnpSecureHash, hashSecret); //check Signature
        if (!checkSignature)
        {
            _logger.LogError("Invalid signature from VNPay response. SecureHash: {vnpSecureHash}", vnpSecureHash);
            return new VnPayResponse()
            {
                Success = false
            };
        }
        return new VnPayResponse()
        {
            Success = true,
            PaymentMethod = "VnPay",
            BookingId = orderId,
            TransactionId = vnPayTranId.ToString(),
            Amount = amount / 100,
            VnPayResponseCode = vnpResponseCode
        };
    }


    public string GetIpAddress(HttpContext context)
    {
        var ipAddress = string.Empty;
        try
        {
            var remoteIpAddress = context.Connection.RemoteIpAddress;

            if (remoteIpAddress != null)
            {
                if (remoteIpAddress.AddressFamily == AddressFamily.InterNetworkV6)
                {
                    remoteIpAddress = Dns.GetHostEntry(remoteIpAddress).AddressList
                        .FirstOrDefault(x => x.AddressFamily == AddressFamily.InterNetwork);
                }

                if (remoteIpAddress != null) ipAddress = remoteIpAddress.ToString();

                return ipAddress;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting IP address.");
            return "127.0.0.1";
        }

        return "127.0.0.1";
    }

    public void AddRequestData(string key, string value)
    {
        if (!string.IsNullOrEmpty(value))
        {
            _requestData.Add(key, value);
        }
    }

    public void AddResponseData(string key, string value)
    {
        if (!string.IsNullOrEmpty(value))
        {
            _responseData.Add(key, value);
        }
    }

    public string GetResponseData(string key)
    {
        return _responseData.TryGetValue(key, out var retValue) ? retValue : string.Empty;
    }

    public string CreateRequestUrl(string baseUrl, string vnpHashSecret)
    {
        var data = new StringBuilder();

        foreach (var (key, value) in _requestData.Where(kv => !string.IsNullOrEmpty(kv.Value)))
        {
            data.Append(WebUtility.UrlEncode(key) + "=" + WebUtility.UrlEncode(value) + "&");
        }

        var querystring = data.ToString();

        if (querystring.Length > 0)
        {
            querystring = querystring.Remove(querystring.Length - 1, 1);
        }

        var signData = querystring;
        var vnpSecureHash = HmacSHA512(vnpHashSecret, signData);
        baseUrl += "?" + querystring + "&vnp_SecureHash=" + vnpSecureHash;

        return baseUrl;
    }

    public string CreatePostRequestUrl(string baseUrl, string vnpHashSecret)
    {
        var data = new StringBuilder();

        foreach (var (key, value) in _requestData.Where(kv => !string.IsNullOrEmpty(kv.Value)))
        {
            data.Append(WebUtility.UrlEncode(key) + "=" + WebUtility.UrlEncode(value) + "&");
        }

        var querystring = data.ToString();

        if (querystring.Length > 0)
        {
            querystring = querystring.Remove(querystring.Length - 1, 1);
        }

        var signData = querystring;
        var vnpSecureHash = HmacSHA512(vnpHashSecret, signData);
        baseUrl += "?" + querystring + "&vnp_SecureHash=" + vnpSecureHash;

        return baseUrl;
    }


    public bool ValidateSignature(string inputHash, string secretKey)
    {
        var rspRaw = GetRawResponseData();
        var myChecksum = HmacSHA512(secretKey, rspRaw);
        var result = myChecksum.Equals(inputHash, StringComparison.InvariantCultureIgnoreCase);
        if (!result)
        {
            _logger.LogWarning("VNPay signature validation failed. Expected: {myChecksum}, Actual: {inputHash}, RawData: {rspRaw}", myChecksum, inputHash, rspRaw);
        }
        return result;
    }
    private string HmacSHA512(string key, string inputData)
    {
        var hash = new StringBuilder();
        var keyBytes = Encoding.UTF8.GetBytes(key);
        var inputBytes = Encoding.UTF8.GetBytes(inputData);
        using (var hmac = new HMACSHA512(keyBytes))
        {
            var hashValue = hmac.ComputeHash(inputBytes);
            foreach (var theByte in hashValue)
            {
                hash.Append(theByte.ToString("x2"));
            }
        }

        return hash.ToString();
    }
    
    private string GetRawResponseData()
    {
        var data = new StringBuilder();
        if (_responseData.ContainsKey("vnp_SecureHashType"))
        {
            _responseData.Remove("vnp_SecureHashType");
        }

        if (_responseData.ContainsKey("vnp_SecureHash"))
        {
            _responseData.Remove("vnp_SecureHash");
        }

        foreach (var (key, value) in _responseData.Where(kv => !string.IsNullOrEmpty(kv.Value)))
        {
            data.Append(WebUtility.UrlEncode(key) + "=" + WebUtility.UrlEncode(value) + "&");
        }

        //remove last '&'
        if (data.Length > 0)
        {
            data.Remove(data.Length - 1, 1);
        }

        return data.ToString();
    }
}

public class VnPayCompare : IComparer<string>
{
    public int Compare(string x, string y)
    {
        if (x == y) return 0;
        if (x == null) return -1;
        if (y == null) return 1;
        var vnpCompare = CompareInfo.GetCompareInfo("en-US");
        return vnpCompare.Compare(x, y, CompareOptions.Ordinal);
    }
}
