interface Citation {
  bibliography_citation: string;
  in_text_citation: string;
}

export function exportCitationsToCSV(
  citations: Citation[],
  filename = "citations.csv"
) {
  // Remove HTML tags from citations
  const cleanHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, "");
  };

  // Create CSV header
  const header = ["Main Citation", "In-text Citation"];

  // Create CSV rows
  const rows = citations.map((citation) => [
    cleanHtml(citation.bibliography_citation),
    cleanHtml(citation.in_text_citation),
  ]);

  // Combine header and rows
  const csvContent = [
    header.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
