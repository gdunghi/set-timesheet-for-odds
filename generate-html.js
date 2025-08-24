// save as generate-html.js
import fs from "fs";
import { exec } from "child_process";

function formatThaiDate(date) {
  try {
    return date.toLocaleString("th-TH", {
      timeZone: "Asia/Bangkok",
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return date;
  }
}

function renderHTML(rows,oddsWorkingDays=0) {
  const trs = rows.map((r, i) => {
    const content = r.content;
    return `
      <tr>
        <td>${i + 1}</td>
        <td>${formatThaiDate(r.createdAt)}</td>
        <td>${r.name || ""}</td>
        <td>${r.email || ""}</td>
        <td>
            <span style="cursor:pointer; position:relative;" onclick="navigator.clipboard.writeText(this.textContent)">${content}</span>
            <span class="copy-icon" title="Copy">
            <svg width="16" height="16" fill="#888" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
            </span>
        </td>
      </tr>`;
  }).join("");

  return `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8" />
<title>Daily Checkouts</title>
<style>
  body { font-family: Arial, "Noto Sans Thai", sans-serif; background:#f8fafc; padding:20px; }
  table { width:100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; }
  th, td { padding: 10px 14px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
  th { background:#f1f5f9; text-align:left; }
  tr:nth-child(even) { background: #f9fafb; }
  strong { color: #2563eb; }
    td { position: relative; }
  .copy-icon {
      display: none;
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s;
  }
  td:hover .copy-icon {
      display: inline-block;
      opacity: 1;
  }
</style>
</head>
<body>
  <h1>Daily Checkouts</h1>
  <h3>ODDS working days is ${oddsWorkingDays}</h3>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>วันที่</th>
        <th>ชื่อ</th>
        <th>อีเมล</th>
        <th>เนื้อหา</th>
      </tr>
    </thead>
    <tbody>
      ${trs}
    </tbody>
  </table>
</body>
</html>`;
}


export function openHTML(data, oddsWorkingDays) {
  const html = renderHTML(data, oddsWorkingDays);

  const filename = "daily-checkouts.html";
  fs.writeFileSync(filename, html, "utf8");
  console.log(`created ${filename}`);

  const opener = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  exec(`${opener} ${filename}`);

}