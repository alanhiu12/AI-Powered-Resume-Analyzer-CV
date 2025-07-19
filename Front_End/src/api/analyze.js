export async function analyzeCVs(files, jobPosition) {
  const formData = new FormData();
  formData.append("job", jobPosition);
  files.forEach(file => formData.append("cvs", file));

  const res = await fetch("http://localhost:5000/analyze-multiple", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Lỗi khi gửi dữ liệu đến server");
  }

  const data = await res.json();
  return data.results || [];
}
