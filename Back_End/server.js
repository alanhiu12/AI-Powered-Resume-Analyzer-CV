const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.CHATPDF_API_KEY;

app.use(cors());
app.use(express.json());

// Cấu hình multer (upload file)
const upload = multer({ dest: 'uploads/' });

// Hàm trích điểm tổng
function extractScore(text) {
  const match = text.match(/(?:Tổng điểm|Điểm phù hợp)[^:]*:\s?\*\*(\d{1,3})\/100/i);
  return match ? parseInt(match[1]) : 0;
}

// Hàm trích điểm từng tiêu chí (breakdown)
function extractBreakdown(text) {
  const lines = text.split("\n");
  const scores = [];

  for (const line of lines) {
    const match = line.match(/\*\*(.*?)\*\*: \*\*(\d{1,3})\/(\d{1,3})\*\*/);
    if (match) {
      scores.push({
        title: match[1].trim(),
        point: parseInt(match[2]),
        max: parseInt(match[3])
      });
    }
  }

  return scores;
}

// Upload 1 file lên ChatPDF
async function uploadCV(filePath) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  try {
    const res = await axios.post('https://api.chatpdf.com/v1/sources/add-file', form, {
      headers: {
        'x-api-key': API_KEY,
        ...form.getHeaders()
      }
    });
    return res.data.sourceId;
  } catch (err) {
    console.error("❌ Upload thất bại:", err.response?.data || err.message);
    return null;
  }
}

// Gửi prompt phân tích
async function analyzeCV(sourceId, jobDesc) {
  const prompt = `
Bạn là hệ thống hỗ trợ tuyển dụng thông minh.

Dựa vào nội dung CV đã tải lên, hãy đánh giá mức độ phù hợp với vị trí: '${jobDesc}' theo 5 tiêu chí sau, mỗi tiêu chí chấm điểm trên thang 100:

1. **Mức độ phù hợp với JD (Job Description)**
2. **Bố cục, trình bày**
3. **Kinh nghiệm, kỹ năng**
4. **Tính trung thực, logic**
5. **Phù hợp văn hoá doanh nghiệp**

Sau đó, tính **Tổng điểm: xx/100**

Trình bày như sau:
- **[Tên tiêu chí]**: **xx/100**
- Nhận xét ngắn gọn dưới mỗi tiêu chí
- Cuối cùng: **Tổng điểm**: **xx/100**

Viết bằng tiếng Việt.
  `;

  try {
    const res = await axios.post(
      'https://api.chatpdf.com/v1/chats/message',
      {
        sourceId,
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    return res.data.content;
  } catch (err) {
    console.error("❌ Phân tích thất bại:", err.response?.data || err.message);
    return "Không có phản hồi từ ChatPDF.";
  }
}

// Route xử lý nhiều file CV
app.post('/analyze-multiple', upload.array('cvs'), async (req, res) => {
  const job = req.body.job || "Lập trình viên";
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ error: "Chưa chọn file nào." });
  }

  const results = [];

  for (const file of files) {
    const sourceId = await uploadCV(file.path);
    if (!sourceId) continue;

    const analysis = await analyzeCV(sourceId, job);
    const score = extractScore(analysis);
    const breakdown = extractBreakdown(analysis);

    results.push({
      file: file.originalname,
      score,
      analysis,
      breakdown
    });

    fs.unlinkSync(file.path); // Xoá file tạm sau khi xử lý
  }

  // Sắp xếp theo điểm giảm dần
  results.sort((a, b) => b.score - a.score);

  res.json({ results });
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`✅ Backend đang chạy tại: http://localhost:${PORT}`);
});
