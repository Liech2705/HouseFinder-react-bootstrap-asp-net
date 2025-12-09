//using Microsoft.ML.OnnxRuntime;
//using Microsoft.ML.OnnxRuntime.Tensors;
//using BERTTokenizers; // Cần cài gói này
//using System.Text;

//namespace MyApi.Api.Services.RAG.Llm
//{
//    public class BertOnnxProvider : ILlmChatProvider, IDisposable
//    {
//        private readonly InferenceSession _session;
//        private readonly BertTokenizer _tokenizer;

//        public BertOnnxProvider(string modelPath)
//        {
//            // 1. Load Model ONNX (chạy trên CPU cho đơn giản, có thể config GPU)
//            _session = new InferenceSession(modelPath);

//            // 2. Khởi tạo Tokenizer (Dùng vocab chuẩn của BERT/RoBERTa)
//            // Lưu ý: Nếu dùng model tiếng Việt (như PhoBERT) thì cần tokenizer riêng
//            _tokenizer = new BertTokenizer();
//        }

//        public Task<string> AskAsync(string system, string user, CancellationToken ct = default)
//        {
//            // TRONG MÔ HÌNH NÀY:
//            // 'system' = Context (Đoạn văn bản tìm được từ Vector DB)
//            // 'user' = Question (Câu hỏi người dùng)

//            return Task.Run(() =>
//            {
//                // 1. Tokenize: Mã hóa câu hỏi và đoạn văn thành số
//                // BERT cần input dạng: [CLS] Question [SEP] Context [SEP]
//                var encoded = _tokenizer.Encode(user, system);

//                // 2. Tạo Input Tensor cho ONNX
//                var inputIds = new DenseTensor<long>(encoded.InputIds.ToArray(), new[] { 1, encoded.InputIds.Count });
//                var attentionMask = new DenseTensor<long>(encoded.AttentionMask.ToArray(), new[] { 1, encoded.AttentionMask.Count });
//                var tokenTypeIds = new DenseTensor<long>(encoded.TokenTypeIds.ToArray(), new[] { 1, encoded.TokenTypeIds.Count });

//                var inputs = new List<NamedOnnxValue>
//                {
//                    NamedOnnxValue.CreateFromTensor("input_ids", inputIds),
//                    NamedOnnxValue.CreateFromTensor("attention_mask", attentionMask),
//                    NamedOnnxValue.CreateFromTensor("token_type_ids", tokenTypeIds)
//                };

//                // 3. Chạy suy luận (Inference)
//                using var results = _session.Run(inputs);

//                // 4. Lấy kết quả (Logits: xác suất điểm đầu và điểm cuối của câu trả lời)
//                var startLogits = results.First(r => r.Name == "start_logits").AsTensor<float>();
//                var endLogits = results.First(r => r.Name == "end_logits").AsTensor<float>();

//                // 5. Tìm vị trí có điểm số cao nhất
//                int bestStart = GetBestIndex(startLogits);
//                int bestEnd = GetBestIndex(endLogits);

//                if (bestStart > bestEnd)
//                {
//                    return "Xin lỗi, không tìm thấy thông tin phù hợp trong tài liệu.";
//                }

//                // 6. Decode lại thành chữ
//                // Lấy các token trong khoảng [Start, End]
//                var answerTokens = encoded.InputIds.Skip(bestStart).Take(bestEnd - bestStart + 1).ToList();
//                var answer = _tokenizer.Decode(answerTokens);

//                return answer;

//            }, ct);
//        }

//        // Hàm phụ trợ tìm index có giá trị lớn nhất
//        private int GetBestIndex(Tensor<float> tensor)
//        {
//            float maxVal = float.MinValue;
//            int bestIdx = 0;
//            var array = tensor.ToArray();

//            for (int i = 0; i < array.Length; i++)
//            {
//                if (array[i] > maxVal)
//                {
//                    maxVal = array[i];
//                    bestIdx = i;
//                }
//            }
//            return bestIdx;
//        }

//        public void Dispose()
//        {
//            _session?.Dispose();
//        }
//    }
//}