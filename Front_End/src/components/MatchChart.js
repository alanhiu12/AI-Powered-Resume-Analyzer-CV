// src/components/MatchChart.js
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, LabelList } from "recharts";

const getColor = (score) => {
  if (score >= 80) return "#28a745";      // xanh lá
  if (score >= 60) return "#ffc107";      // vàng
  return "#dc3545";                       // đỏ
};

function MatchChart({ data }) {
  return (
    <div style={{ marginTop: "40px", background: "#fff", padding: "20px", borderRadius: "10px" }}>
      <h3 style={{ marginBottom: "16px", color: "#333" }}>📈 Biểu đồ so sánh điểm CV</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="file" tick={{ fill: "#333", fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fill: "#333", fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="score">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.score)} />
            ))}
            <LabelList dataKey="score" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MatchChart;
