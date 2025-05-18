import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CitationFormData } from "@/types/schemas";

interface CommonFieldsProps {
  register: UseFormRegister<CitationFormData>;
  errors: FieldErrors<CitationFormData>;
  citationType: "book" | "journal" | "webpage";
}

export function CommonFields({
  register,
  errors,
  citationType,
}: CommonFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="relative">
          <label
            htmlFor="editors"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Editors Name
          </label>
          <input
            type="text"
            id="editors"
            className={`w-full px-3 py-2 border ${
              errors.editors ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter editors (if any)"
            {...register("editors")}
          />
        </div>

        {citationType !== "webpage" && (
          <div className="relative">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {citationType === "journal" ? "Publication Date" : "Date"}
            </label>
            <input
              type="text"
              id="date"
              className={`w-full px-3 py-2 border ${
                errors.date ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="YYYY-MM-DD or YYYY"
              {...register("date")}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">
                {errors.date?.message}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {citationType !== "webpage" && (
          <div className="relative">
            <label
              htmlFor="url"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              URL{" "}
            </label>
            <input
              type="text"
              id="url"
              className={`w-full px-3 py-2 border ${
                errors.url ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="https://example.com/"
              {...register("url")}
            />
            {errors.url && (
              <p className="mt-1 text-sm text-red-600">{errors.url?.message}</p>
            )}
          </div>
        )}

        <div className="relative">
          <label
            htmlFor="doi"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            DOI
          </label>
          <input
            type="text"
            id="doi"
            className={`w-full px-3 py-2 border ${
              errors.doi ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="e.g., 10.1000/xyz123"
            {...register("doi")}
          />
        </div>
      </div>
    </>
  );
}
