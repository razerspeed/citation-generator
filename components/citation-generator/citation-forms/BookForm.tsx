import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CitationFormData } from "@/types/schemas";

interface BookFormProps {
  register: UseFormRegister<CitationFormData>;
  errors: FieldErrors<CitationFormData>;
  hasBookField: (fieldName: string) => boolean;
  getFieldErrorMessage: (fieldName: string) => string | undefined;
}

export function BookForm({
  register,
  errors,
  hasBookField,
  getFieldErrorMessage,
}: BookFormProps) {
  return (
    <>
      <div>
        <label
          htmlFor="bookTitle"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Book Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="bookTitle"
          className={`w-full px-3 py-2 border ${
            hasBookField("bookTitle") ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Enter book title"
          {...register("bookTitle")}
        />
        {hasBookField("bookTitle") && (
          <p className="mt-1 text-sm text-red-600">
            {getFieldErrorMessage("bookTitle")}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="relative">
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
              hasBookField("publisherName")
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter publisher name"
            {...register("publisherName")}
          />
        </div>

        <div className="relative">
          <label
            htmlFor="publisherPlace"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Publisher Place
          </label>
          <input
            type="text"
            id="publisherPlace"
            className={`w-full px-3 py-2 border ${
              hasBookField("publisherPlace")
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="City, Country"
            {...register("publisherPlace")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="relative">
          <label
            htmlFor="edition"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Edition
          </label>
          <input
            type="text"
            id="edition"
            className={`w-full px-3 py-2 border ${
              hasBookField("edition") ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="e.g., 2nd Edition"
            {...register("edition")}
          />
        </div>

        <div className="relative">
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
              hasBookField("volume") ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="e.g., Vol. 2"
            {...register("volume")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="relative">
          <label
            htmlFor="medium"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Medium
          </label>
          <input
            type="text"
            id="medium"
            className={`w-full px-3 py-2 border ${
              hasBookField("medium") ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="e.g., Print, E-book"
            {...register("medium")}
          />
        </div>

        <div className="relative">
          <label
            htmlFor="source"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Source
          </label>
          <input
            type="text"
            id="source"
            className={`w-full px-3 py-2 border ${
              hasBookField("source") ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="e.g., Library, Database name"
            {...register("source")}
          />
        </div>
      </div>
    </>
  );
}
