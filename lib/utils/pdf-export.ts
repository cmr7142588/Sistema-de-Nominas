export interface PDFExportData {
  title: string
  subtitle?: string
  data: any[]
  columns: { key: string; label: string; type?: "currency" | "date" | "text" }[]
  summary?: { label: string; value: string | number }[]
}

export function generatePDFContent(data: PDFExportData): string {
  const { title, subtitle, data: tableData, columns, summary } = data

  // Generate HTML content for PDF
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; }
        .title { font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 5px; }
        .subtitle { font-size: 14px; color: #6b7280; }
        .summary { display: flex; justify-content: space-around; margin: 20px 0; }
        .summary-item { text-align: center; padding: 15px; background: #f9fafb; border-radius: 8px; }
        .summary-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
        .summary-value { font-size: 18px; font-weight: bold; color: #1f2937; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background-color: #f9fafb; font-weight: 600; color: #374151; }
        .currency { text-align: right; font-weight: 500; }
        .date { color: #6b7280; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #9ca3af; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">${title}</div>
        ${subtitle ? `<div class="subtitle">${subtitle}</div>` : ""}
      </div>
  `

  // Add summary if provided
  if (summary && summary.length > 0) {
    html += '<div class="summary">'
    summary.forEach((item) => {
      html += `
        <div class="summary-item">
          <div class="summary-label">${item.label}</div>
          <div class="summary-value">${item.value}</div>
        </div>
      `
    })
    html += "</div>"
  }

  // Add table
  html += "<table><thead><tr>"
  columns.forEach((col) => {
    html += `<th>${col.label}</th>`
  })
  html += "</tr></thead><tbody>"

  tableData.forEach((row) => {
    html += "<tr>"
    columns.forEach((col) => {
      const value = row[col.key]
      let formattedValue = value

      if (col.type === "currency" && typeof value === "number") {
        formattedValue = `$${value.toLocaleString()}`
      } else if (col.type === "date" && value) {
        formattedValue = new Date(value).toLocaleDateString()
      }

      const className = col.type === "currency" ? "currency" : col.type === "date" ? "date" : ""
      html += `<td class="${className}">${formattedValue || "-"}</td>`
    })
    html += "</tr>"
  })

  html += `
      </tbody></table>
      <div class="footer">
        Generado el ${new Date().toLocaleDateString()} - Sistema de Nóminas
      </div>
    </body>
    </html>
  `

  return html
}

export function downloadPDF(htmlContent: string, filename: string) {
  // Create a new window for printing
  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print()
      // Close window after printing (optional)
      setTimeout(() => printWindow.close(), 1000)
    }
  }
}
