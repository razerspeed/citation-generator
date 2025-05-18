import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CitationFormData } from "@/types/schemas";

interface JournalFormProps {
  register: UseFormRegister<CitationFormData>;
  errors: FieldErrors<CitationFormData>;
  hasJournalField: (fieldName: string) => boolean;
  getFieldErrorMessage: (fieldName: string) => string | undefined;
}

export function JournalForm({
  register,
  errors,
  hasJournalField,
  getFieldErrorMessage,
}: JournalFormProps) {
  return (
    <>
      <div>
        <label
          htmlFor="articleTitle"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Journal Article Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="articleTitle"
          className={`w-full px-3 py-2 border ${
            hasJournalField("articleTitle")
              ? "border-red-500"
              : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Enter article title"
          {...register("articleTitle")}
        />
        {hasJournalField("articleTitle") && (
          <p className="mt-1 text-sm text-red-600">
            {getFieldErrorMessage("articleTitle")}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="journalName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Journal Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="journalName"
          className={`w-full px-3 py-2 border ${
            hasJournalField("journalName")
              ? "border-red-500"
              : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Enter journal name"
          {...register("journalName")}
        />
        {hasJournalField("journalName") && (
          <p className="mt-1 text-sm text-red-600">
            {getFieldErrorMessage("journalName")}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label
            htmlFor="volume"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Volume
          </label>
          <input
            type="text"
            id="volume"
            className={`w-full px-3 py-2 border ${
              hasJournalField("volume") ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="e.g., 42"
            {...register("volume")}
          />
        </div>

        <div>
          <label
            htmlFor="issue"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Issue
          </label>
          <input
            type="text"
            id="issue"
            className={`w-full px-3 py-2 border ${
              hasJournalField("issue") ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="e.g., 3"
            {...register("issue")}
          />
        </div>

        <div>
          <label
            htmlFor="pages"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Pages
          </label>
          <input
            type="text"
            id="pages"
            className={`w-full px-3 py-2 border ${
              hasJournalField("pages") ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="e.g., 123-145"
            {...register("pages")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="publisherName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Publisher Name
          </label>
          <input
            type="text"
            id="publisherName"
            className={`w-full px-3 py-2 border ${
              hasJournalField("publisherName")
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter publisher name"
            {...register("publisherName")}
          />
        </div>

        <div>
          <label
            htmlFor="extra"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Extra
          </label>
          <input
            type="text"
            id="extra"
            className={`w-full px-3 py-2 border ${
              hasJournalField("extra") ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Additional information"
            {...register("extra")}
          />
        </div>
      </div>
    </>
  );
}
