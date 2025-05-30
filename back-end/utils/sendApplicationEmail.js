import transporter from "./MailserVices.js";

export async function sendApplicationEmail({ to, application, scholarship, user, school, certificatesPopulated }) {
  const snapshot = application.profileSnapshot || {};
  const grades10 = snapshot.grades10 || [];
  const grades11 = snapshot.grades11 || [];
  const grades12 = snapshot.grades12 || [];
  const certificates = certificatesPopulated !== undefined ? certificatesPopulated : (snapshot.certificates || []);
  const essay = application.essay || '';
  const documents = application.documents || [];

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;">
      <h2 style="color:#2d7ff9;">Xác nhận nộp hồ sơ học bổng</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td><b>Học bổng:</b></td><td>${scholarship.name || scholarship.title}</td></tr>
        <tr><td><b>Trường:</b></td><td>${school?.name || ''}</td></tr>
        <tr><td><b>Nơi nộp:</b></td><td>${scholarship.location || ''}</td></tr>
        <tr><td><b>Trạng thái:</b></td><td>${application.status}</td></tr>
        <tr><td><b>Ngày nộp:</b></td><td>${new Date(application.createdAt).toLocaleString()}</td></tr>
        <tr><td><b>Bài luận:</b></td><td>${essay ? essay.replace(/\n/g, '<br/>') : ''}</td></tr>
      </table>
      ${documents.length > 0 ? `
      <h3>Tài liệu đã nộp</h3>
      <ul>
        ${documents.map((doc, i) => `<li><b>${doc.name}:</b> <a href="${doc.url}" target="_blank">${doc.url}</a></li>`).join('')}
      </ul>
      ` : ''}
      <h3>Bảng điểm lớp 10</h3>
      <table border="1" cellpadding="5" style="border-collapse:collapse;width:100%;">
        <tr><th>Môn</th><th>Điểm</th></tr>
        ${grades10.map(g => `<tr><td>${g.subject}</td><td>${g.score}</td></tr>`).join('')}
      </table>
      <h3>Bảng điểm lớp 11</h3>
      <table border="1" cellpadding="5" style="border-collapse:collapse;width:100%;">
        <tr><th>Môn</th><th>Điểm</th></tr>
        ${grades11.map(g => `<tr><td>${g.subject}</td><td>${g.score}</td></tr>`).join('')}
      </table>
      <h3>Bảng điểm lớp 12</h3>
      <table border="1" cellpadding="5" style="border-collapse:collapse;width:100%;">
        <tr><th>Môn</th><th>Điểm</th></tr>
        ${grades12.map(g => `<tr><td>${g.subject}</td><td>${g.score}</td></tr>`).join('')}
      </table>
      <h3>Chứng chỉ</h3>
      <table border="1" cellpadding="5" style="border-collapse:collapse;width:100%;">
        <tr><th>Loại</th><th>Điểm</th><th>Ngày</th></tr>
        ${certificates.length === 0 ? `<tr><td colspan='3' style='text-align:center;'>Không có chứng chỉ nào</td></tr>` :
          certificates.map(c =>
            `<tr><td>${c.certificateType?.name || c.certificateType}</td><td>${c.score}</td><td>${c.date ? new Date(c.date).toLocaleDateString() : ''}</td></tr>`
          ).join('')}
      </table>
      <p style="margin-top:20px;">Cảm ơn bạn <b>${user.firstName} ${user.lastName}</b> đã sử dụng hệ thống!</p>
    </div>
  `;
  await transporter.sendMail({
    from: `Scholarship System <${process.env.MAIL_USER}>`,
    to,
    subject: "Xác nhận nộp hồ sơ học bổng",
    html,
  });
} 