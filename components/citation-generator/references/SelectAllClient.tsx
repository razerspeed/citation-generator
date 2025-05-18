"use client";

import { useState } from "react";
import { Reference } from "@/types/references";
import { BulkActions } from "./BulkActions";

interface SelectAllClientProps {
  references: Reference[];
  render: (
    selectedItems: Set<string>,
    handleSelectItem: (id: string) => void
  ) => React.ReactNode;
}

export function SelectAllClient({ references, render }: SelectAllClientProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

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

  return (
    <>
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
        <BulkActions selectedItems={selectedItems} references={references} />
      </div>
      {render(selectedItems, handleSelectItem)}
    </>
  );
}
