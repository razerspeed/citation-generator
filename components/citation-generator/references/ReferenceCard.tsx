"use client";

import { Reference } from "@/types/references";
import { CopyButton } from "./buttons/CopyButton";
import { DeleteButton } from "./buttons/DeleteButton";

interface ReferenceCardProps {
  reference: Reference;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete?: () => void;
  onCitationSelect?: (citation: Reference) => void;
}

export function ReferenceCard({
  reference,
  isSelected,
  onSelect,
  onDelete,
  onCitationSelect,
}: ReferenceCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div
      onClick={(e) => {
        if (
          !(e.target as HTMLElement).closest('input[type="checkbox"]') &&
          !(e.target as HTMLElement).closest("button")
        ) {
          onCitationSelect?.(reference);
        }
      }}
      className={`bg-white rounded-lg border border-gray-200 p-4 sm:p-6 cursor-pointer hover:border-purple-300 transition-colors ${
        isSelected ? "border-purple-500" : ""
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(reference.id)}
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
                    <CopyButton text={reference.bibliography_citation} />
                    <DeleteButton id={reference.id} onDelete={onDelete} />
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
                  <CopyButton text={reference.in_text_citation} />
                </div>
                <p className="text-gray-600">{reference.in_text_citation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
