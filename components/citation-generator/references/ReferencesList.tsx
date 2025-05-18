import { Reference } from "@/types/references";
import { ReferenceCard } from "./ReferenceCard";
import { SelectAllClient } from "./SelectAllClient";

interface ReferencesListProps {
  references: Reference[];
  onCitationSelect?: (citation: Reference) => void;
  onDelete?: () => void;
  title?: string;
  showBorder?: boolean;
  showTopSpacing?: boolean;
}

type SelectItemHandler = (id: string) => void;

export function ReferencesList({
  references,
  onCitationSelect,
  onDelete,
  title = "Saved Citations",
  showBorder = true,
  showTopSpacing = true,
}: ReferencesListProps) {
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

        <SelectAllClient
          references={references}
          render={(
            selectedItems: Set<string>,
            handleSelectItem: SelectItemHandler
          ) => (
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-lg p-4 sm:p-6 mb-6">
                {references.map((reference) => (
                  <ReferenceCard
                    key={reference.id}
                    reference={reference}
                    isSelected={selectedItems.has(reference.id)}
                    onSelect={handleSelectItem}
                    onCitationSelect={onCitationSelect}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
