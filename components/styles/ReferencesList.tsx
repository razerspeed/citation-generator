import { useState } from "react";
import { Download, Copy, CheckCircle2, Trash2 } from "lucide-react";
import { deleteCitation, deleteSelectedCitations } from "@/actions/citations";
import { exportCitationsToCSV } from "@/utils/exportCitations";
import { toast } from "react-toastify";

interface Reference {
  id: string;
  citation_data: {
    title: string;
    type: string;
    style: string;
    authors?: string[];
    year?: string;
    journal?: string;
    volume?: string;
    issue?: string;
    pages?: string;
    doi?: string;
    url?: string;
    publisher?: string;
  };
  in_text_citation: string;
  bibliography_citation: string;
  created_at: string;
}

interface ReferencesListProps {
  references: Reference[];
  onCitationSelect?: (citation: Reference) => void;
  onDelete?: () => void;
  title?: string;
  showBorder?: boolean;
  showTopSpacing?: boolean;
}

export function ReferencesList({
  references,
  onCitationSelect,
  onDelete,
  title = "Saved Citations",
  showBorder = true,
  showTopSpacing = true,
}: ReferencesListProps) {
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
            Saved Citations
          </h2>
          <div className={`flex-1 ${showBorder ? "" : ""}`}></div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
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
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkDelete}
                disabled={selectedItems.size === 0}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
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
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
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
                onCitationSelect?.(reference);
              }
            }}
            className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:border-purple-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selectedItems.has(reference.id)}
                onChange={(e) => {
                  e.stopPropagation();
                  handleSelectItem(reference.id);
                }}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-700">
                            Main Citation:
                          </p>
                          <button
                            onClick={(e) =>
                              handleCopy(
                                e,
                                reference.bibliography_citation,
                                reference.id,
                                "main"
                              )
                            }
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            title="Copy main citation"
                          >
                            {copiedStates[`${reference.id}-main`] ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, reference.id)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors text-red-500 hover:text-red-600"
                            title="Delete citation"
                            disabled={deletingStates[reference.id]}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-gray-600">
                          {reference.bibliography_citation}
                        </p>
                        <div className="flex gap-2 mt-2 text-sm text-gray-500">
                          <span>
                            {reference.citation_data.type
                              .charAt(0)
                              .toUpperCase() +
                              reference.citation_data.type.slice(1)}
                          </span>
                          <span>•</span>
                          <span>{reference.citation_data.style}</span>
                          <span>•</span>
                          <span>{formatDate(reference.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <p className="font-medium text-gray-700">
                        In-text citation:
                      </p>
                      <button
                        onClick={(e) =>
                          handleCopy(
                            e,
                            reference.in_text_citation,
                            reference.id,
                            "intext"
                          )
                        }
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        title="Copy in-text citation"
                      >
                        {copiedStates[`${reference.id}-intext`] ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-500" />
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
        ))}
      </div>
    </div>
  );
}
