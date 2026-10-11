/**
 * Shared Report Export & Print Utilities
 */

export function exportToCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const sanitize = (val: string | number | undefined | null) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvContent = [
    headers.map(sanitize).join(","),
    ...rows.map((row) => row.map(sanitize).join(",")),
  ].join("\r\n");

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function triggerPrint() {
  window.print();
}

export function escapeReportHtml(value: string | number) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function wrapReportHtml(title: string, content: string) {
  return `<!doctype html><html><head><meta charset="UTF-8"><title>${escapeReportHtml(title)}</title><style>
    body{font-family:Arial,sans-serif;color:#111;margin:24px}h1{text-align:center;font-size:18px;margin:0 0 16px}
    h2{font-size:14px;margin:20px 0 8px}table{border-collapse:collapse;width:100%;margin:0 0 16px}
    th,td{border:1px solid #555;padding:6px;text-align:center}th{background:#eee}td:first-child{text-align:left}
    tfoot{font-weight:bold;background:#f2f2f2}@media print{body{margin:0}}
  </style></head><body><h1>${escapeReportHtml(title)}</h1>${content}</body></html>`;
}

export function exportHtmlToExcel(filename: string, title: string, content: string) {
  const blob = new Blob(["\uFEFF", wrapReportHtml(title, content)], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".xls") ? filename : `${filename}.xls`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function printReportHtml(title: string, content: string) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  printWindow.document.open();
  printWindow.document.write(wrapReportHtml(title, content));
  printWindow.document.close();
  printWindow.focus();
  window.setTimeout(() => printWindow.print(), 300);
}
