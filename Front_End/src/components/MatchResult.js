import React from "react";
import "./styles/MatchResult.css";

function MatchResult({ data }) {
  return (
    <div className="result-table-container">
      <h3 style={{ marginBottom: "16px" }}>📊 Kết quả phân tích & xếp hạng CV</h3>
      <table className="result-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên File</th>
            <th>Điểm Phù Hợp</th>
            <th>Chi Tiết & Nhận Xét</th>
          </tr>
        </thead>
        <tbody>
          {data.map((res, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{res.file}</td>
              <td style={{ fontWeight: "bold", color: "black" }}>
                {res.score}/100
              </td>
              <td style={{ whiteSpace: "pre-line", color: "black" }}>
                {res.breakdown && res.breakdown.length > 0 ? (
                  <>
                    <ul style={{ paddingLeft: "16px", marginBottom: "6px" }}>
                      {res.breakdown.map((b, i) => (
                        <li key={i}>
                          {b.title}: {b.point}/{b.max}
                        </li>
                      ))}
                    </ul>
                    <hr style={{ margin: "6px 0" }} />
                    {res.analysis}
                  </>
                ) : (
                  res.analysis
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MatchResult;
