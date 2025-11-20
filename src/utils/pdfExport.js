// simple PDF export using jsPDF
import { jsPDF } from "jspdf";

/**
 * data = { type: 'email'|'password', query, result }
 */
export function exportBreachReportPDF(data) {
  try {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const title = data.type === "email" ? "Email Breach Report" : "Password Breach Report";
    doc.setFontSize(18);
    doc.text(title, 40, 60);
    doc.setFontSize(12);
    doc.text(`Query: ${data.query}`, 40, 90);
    doc.text(`Date: ${new Date().toLocaleString()}`, 40, 110);
    doc.setFontSize(13);

    if (data.result) {
      if (data.result.error) {
        doc.setTextColor(200, 60, 60);
        doc.text(`Error: ${data.result.message || data.result.details}`, 40, 140);
      } else if (data.result.breached) {
        doc.setTextColor(0, 0, 0);
        doc.text(`Breaches found: ${data.result.data ? data.result.data.length : (data.result.count || 0)}`, 40, 140);
        let y = 170;
        if (Array.isArray(data.result.data)) {
          data.result.data.forEach((item, i) => {
            doc.text(`${i + 1}. ${String(item)}`, 48, y);
            y += 18;
            if (y > 740) {
              doc.addPage();
              y = 40;
            }
          });
        } else {
          doc.text(JSON.stringify(data.result), 48, 170);
        }
      } else {
        doc.text("No breaches found.", 40, 140);
      }
    }

    doc.save(`${title.replace(/\s+/g, "_")}_${Date.now()}.pdf`);
  } catch (err) {
    console.error("PDF export error", err);
    alert("Unable to export PDF: " + err.message);
  }
}
