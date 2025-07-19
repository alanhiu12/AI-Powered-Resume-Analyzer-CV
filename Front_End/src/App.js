import React, { useState } from "react";
import CVUpload from "./components/CVUpload";
import JobDescriptionInput from "./components/JobDescriptionInput";
import MatchResult from "./components/MatchResult";
import MatchChart from "./components/MatchChart"; // THÊM BIỂU ĐỒ
import { analyzeCVs } from "./api/analyze";
import './App.css';
import bg from './img/bg.jpg';

function App() {
  const [cvFiles, setCVFiles] = useState([]);
  const [jobDesc, setJobDesc] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAnalyze = async () => {
    if (!jobDesc || cvFiles.length === 0) {
      setErrorMsg("⚠️ Vui lòng chọn CV và nhập mô tả công việc!");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    setLoading(true);
    try {
      const res = await analyzeCVs(cvFiles, jobDesc);
      setResults(res);
    } catch (error) {
      console.error("Lỗi phân tích CV:", error);
      alert("Đã xảy ra lỗi khi phân tích CV.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="app-background"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="overlay" />
      <div className="container">
        <h1 className="colored-text">Hệ Thống Phân Tích CV Thông Minh Ứng Dụng AI</h1>
        <p className="subtitle">Upload nhiều CV cùng lúc và nhận kết quả phân tích tự động với điểm số và biểu đồ so sánh</p>

        <div className="form-row">
          <JobDescriptionInput value={jobDesc} onChange={setJobDesc} />
          <CVUpload onFileSelect={setCVFiles} multiple />
        </div>

        <button className="upload-btn" onClick={handleAnalyze} disabled={loading}>
          {loading ? "⏳ Loading..." : "📤 Phân tích CV"}
        </button>

        {errorMsg && <p className="error">{errorMsg}</p>}

        {results.length > 0 && (
          <>
            <MatchChart data={results} />
            <MatchResult data={results} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
