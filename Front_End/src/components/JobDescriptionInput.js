import React from "react";

function JobDescriptionInput({ value, onChange }) {
  return (
    <div className="form-group">
      <label>Mô tả công việc</label>
      <textarea className="job-description"
        rows={10}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Nhập yêu cầu công việc hoặc mô tả vị trí ứng tuyển..."
      />
    </div>
  );
}

export default JobDescriptionInput;
