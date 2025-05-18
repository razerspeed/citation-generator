import { useState } from "react";
import { Download, Copy, CheckCircle2, Trash2 } from "lucide-react";
import { deleteCitation, deleteSelectedCitations } from "@/actions/citations";
import { exportCitationsToCSV } from "@/utils/exportCitations";
import { toast } from "react-toastify";
import { useCitation } from "@/contexts/CitationContext";

interface Reference {
  id: string;
  citation_data: {
    type: "book" | "journal" | "webpage";
    style: string;

    // Common fields
    authors?: string;
    editors?: string;
    date?: string;
    doi?: string;
    url?: string;
    publisherName?: string;
    volume?: string;

    // Book specific fields
    bookTitle?: string;
    publisherPlace?: string;
    edition?: string;
    medium?: string;
    source?: string;

    // Journal specific fields
    articleTitle?: string;
    journalName?: string;
    issue?: string;
    pages?: string;
    extra?: string;

    // Webpage specific fields
    websiteTitle?: string;
    datePublished?: string;
    dateAccessed?: string;
  };
  in_text_citation: string;
  bibliography_citation: string;
  created_at: string;
}

interface ReferencesListProps {
  references: Reference[];
  onDelete?: () => void;
  title?: string;
  showBorder?: boolean;
  showTopSpacing?: boolean;
}

export function ReferencesList({
  references,
  onDelete,
  title = "Saved Citations",
  showBorder = true,
  showTopSpacing = true,
}: ReferencesListProps) {
  const { setFormData, setRenderedCitation, setSelectedStyle, setSearchTerm } =
    useCitation();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [deletingStates, setDeletingStates] = useState<{
    [key: string]: boolean;
  }>({});

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(new Set(references.map((ref) => ref.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const handleCopy = async (
    e: React.MouseEvent,
    text: string,
    id: string,
    type: "main" | "intext"
  ) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates({ ...copiedStates, [`${id}-${type}`]: true });
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [`${id}-${type}`]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      setDeletingStates((prev) => ({ ...prev, [id]: true }));
      const { error } = await deleteCitation(id);

      if (error) {
        throw new Error(error);
      }

      toast.success("Citation deleted successfully");
      onDelete?.();
    } catch (err) {
      console.error("Error deleting citation:", err);
      toast.error("Failed to delete citation");
    } finally {
      setDeletingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) {
      toast.error("Please select at least one citation to delete.");
      return;
    }

    try {
      const { error } = await deleteSelectedCitations(
        Array.from(selectedItems)
      );

      if (error) {
        throw new Error(error);
      }

      toast.success(
        `Successfully deleted ${selectedItems.size} citation${
          selectedItems.size === 1 ? "" : "s"
        }`
      );

      setSelectedItems(new Set());
      onDelete?.();
    } catch (err) {
      console.error("Error deleting citations:", err);
      toast.error("Failed to delete citations");
    }
  };

  const handleExport = () => {
    const selectedCitations = references.filter((ref) =>
      selectedItems.has(ref.id)
    );
    if (selectedCitations.length === 0) {
      alert("Please select at least one citation to export.");
      return;
    }

    const timestamp = new Date().toISOString().split("T")[0];
    exportCitationsToCSV(selectedCitations, `citations-${timestamp}.csv`);
  };

  const handleCitationSelect = (reference: Reference) => {
    // Set the form data from the citation data
    const formData = (() => {
      switch (reference.citation_data.type) {
        case "book":
          return {
            type: "book" as const,
            authors: reference.citation_data.authors || "",
            editors: reference.citation_data.editors || "",
            bookTitle: reference.citation_data.bookTitle || "",
            publisherName: reference.citation_data.publisherName || "",
            publisherPlace: reference.citation_data.publisherPlace || "",
            edition: reference.citation_data.edition || "",
            volume: reference.citation_data.volume || "",
            medium: reference.citation_data.medium || "",
            source: reference.citation_data.source || "",
            doi: reference.citation_data.doi || "",
            url: reference.citation_data.url || "",
            date: reference.citation_data.date || "",
          };
        case "journal":
          return {
            type: "journal" as const,
            authors: reference.citation_data.authors || "",
            editors: reference.citation_data.editors || "",
            articleTitle: reference.citation_data.articleTitle || "",
            journalName: reference.citation_data.journalName || "",
            volume: reference.citation_data.volume || "",
            issue: reference.citation_data.issue || "",
            pages: reference.citation_data.pages || "",
            extra: reference.citation_data.extra || "",
            publisherName: reference.citation_data.publisherName || "",
            doi: reference.citation_data.doi || "",
            url: reference.citation_data.url || "",
            date: reference.citation_data.date || "",
          };
        case "webpage":
          return {
            type: "webpage" as const,
            authors: reference.citation_data.authors || "",
            editors: reference.citation_data.editors || "",
            articleTitle: reference.citation_data.articleTitle || "",
            websiteTitle: reference.citation_data.websiteTitle || "",
            datePublished: reference.citation_data.datePublished || "",
            dateAccessed: reference.citation_data.dateAccessed || "",
            extra: reference.citation_data.extra || "",
            doi: reference.citation_data.doi || "",
            url: reference.citation_data.url || "",
            date: reference.citation_data.date || "",
          };
        default:
          return null;
      }
    })();

    if (!formData) {
      toast.error("Invalid citation type");
      return;
    }

    // Set the style and search term
    const styleName = reference.citation_data.style;
    setSelectedStyle({
      id: styleName.toLowerCase(),
      name: styleName,
      filename: styleName.toLowerCase(),
    });
    setSearchTerm(styleName);

    // Set the form data
    setFormData(formData);

    // Set the rendered citation
    setRenderedCitation({
      inTextCitation: reference.in_text_citation,
      bibliographyCitation: reference.bibliography_citation,
    });

    // Scroll to the citation form
    const citationForm = document.querySelector(".citation-form");
    if (citationForm) {
      citationForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div
        className={`${showBorder ? "" : ""} ${showTopSpacing ? "pt-2" : ""}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`flex-1 ${showBorder ? "" : ""}`}></div>
          <h2 className="text-2xl font-bold text-purple-700 whitespace-nowrap flex items-center gap-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            {title}
          </h2>
          <div className={`flex-1 ${showBorder ? "" : ""}`}></div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    selectedItems.size === references.length &&
                    references.length > 0
                  }
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-600">Select all</span>
              </div>
              <div className="text-sm text-gray-600">
                {references.length}{" "}
                {references.length === 1 ? "citation" : "citations"} saved
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleBulkDelete}
                disabled={selectedItems.size === 0}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium w-full sm:w-auto justify-center ${
                  selectedItems.size > 0
                    ? "text-white bg-red-600 hover:bg-red-700"
                    : "text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed"
                } rounded-md transition-colors`}
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected
              </button>
              <button
                onClick={handleExport}
                disabled={selectedItems.size === 0}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium w-full sm:w-auto justify-center ${
                  selectedItems.size > 0
                    ? "text-white bg-purple-600 hover:bg-purple-700"
                    : "text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed"
                } rounded-md transition-colors`}
              >
                <Download className="h-4 w-4" />
                Export as CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {references.map((reference) => (
          <div
            key={reference.id}
            onClick={(e) => {
              if (
                !(e.target as HTMLElement).closest('input[type="checkbox"]') &&
                !(e.target as HTMLElement).closest("button")
              ) {
                handleCitationSelect(reference);
              }
            }}
            className={`bg-white rounded-lg border border-gray-200 p-4 sm:p-6 cursor-pointer hover:border-purple-300 transition-colors ${
              selectedItems.has(reference.id) ? "border-purple-500" : ""
            }`}
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={selectedItems.has(reference.id)}
                  onChange={() => handleSelectItem(reference.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500 capitalize">
                        {reference.citation_data.type}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">
                        {reference.citation_data.style}
                      </span>
                    </div>
                    <span className="text-gray-300 hidden sm:inline">•</span>
                    <span className="text-sm text-gray-500">
                      {formatDate(reference.created_at)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          Main Citation:
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) =>
                              handleCopy(
                                e,
                                reference.bibliography_citation,
                                reference.id,
                                "main"
                              )
                            }
                            className="text-purple-600 hover:text-purple-700"
                          >
                            {copiedStates[`${reference.id}-main`] ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, reference.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            {deletingStates[reference.id] ? (
                              <div className="h-4 w-4 border-2 border-t-red-600 rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600">
                        {reference.bibliography_citation}
                      </p>
                    </div>

                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          In-text citation:
                        </span>
                        <button
                          onClick={(e) =>
                            handleCopy(
                              e,
                              reference.in_text_citation,
                              reference.id,
                              "intext"
                            )
                          }
                          className="text-purple-600 hover:text-purple-700"
                        >
                          {copiedStates[`${reference.id}-intext`] ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-gray-600">
                        {reference.in_text_citation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
