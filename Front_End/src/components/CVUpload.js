import React, { useState } from "react";
import "./styles/CVUpload.css";

function CVUpload({ onFileSelect, multiple = true }) {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    const updatedFiles = multiple
      ? [...selectedFiles, ...files]
      : files;

    setSelectedFiles(updatedFiles);
    onFileSelect(updatedFiles);
  };

  const handleDelete = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    onFileSelect(updatedFiles);
  };

  return (
    <div className="cv-upload-container">
      <input
        type="file"
        accept=".pdf"
        multiple={multiple}
        onChange={handleChange}
      />

      {selectedFiles.length > 0 && (
        <ul className="file-list">
          {selectedFiles.map((file, index) => (
            <li key={index} className="file-item">
              <span className="file-name">{file.name}</span>
              <button
                className="delete-btn"
                onClick={() => handleDelete(index)}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CVUpload;
