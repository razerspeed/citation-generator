"use client";

import { Download, Trash2 } from "lucide-react";
import { deleteSelectedCitations } from "@/actions/citations";
import { exportCitationsToCSV } from "@/utils/exportCitations";
import { toast } from "react-toastify";
import { Reference } from "@/types/references";

interface BulkActionsProps {
  selectedItems: Set<string>;
  references: Reference[];
  onDelete?: () => void;
}

export function BulkActions({
  selectedItems,
  references,
  onDelete,
}: BulkActionsProps) {
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
      toast.error("Please select at least one citation to export.");
      return;
    }

    const timestamp = new Date().toISOString().split("T")[0];
    exportCitationsToCSV(selectedCitations, `citations-${timestamp}.csv`);
  };

  return (
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
  );
}
