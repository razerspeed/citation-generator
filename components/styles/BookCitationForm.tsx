import React from "react";
import { Style } from "@/types/styles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookCitationSchema, BookCitationFormData } from "@/types/schemas";

interface BookCitationFormProps {
  selectedStyle: Style;
  onCancel: () => void;
  onSubmit: (data: BookCitationFormData) => void;
}

export function BookCitationForm({
  selectedStyle,
  onCancel,
  onSubmit,
}: BookCitationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookCitationFormData>({
    resolver: zodResolver(bookCitationSchema),
    defaultValues: {
      bookTitle: "",
      publisherName: "",
      publisherPlace: "",
      authors: "",
      editors: "",
      edition: "",
      volume: "",
      medium: "",
      url: "",
      doi: "",
      date: "",
      source: "",
    },
  });

  const onFormSubmit = (data: BookCitationFormData) => {
    onSubmit(data);
  };

  // Check if a style is properly selected
  const hasValidStyle = selectedStyle && selectedStyle.id !== "";

  return (
    <div className="bg-white border border-gray-300 rounded-md shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Book Citation Information</h2>
      {hasValidStyle ? (
        <p className="text-gray-600 mb-4">
          Enter the details for your book citation using the{" "}
          {selectedStyle.name} style.
        </p>
      ) : (
        <p className="text-gray-600 mb-4">
          Enter the details for your book citation. Please select a citation
          style from the right panel.
        </p>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="space-y-4">
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
                errors.bookTitle ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter book title"
              {...register("bookTitle")}
            />
            {errors.bookTitle && (
              <p className="mt-1 text-sm text-red-600">
                {errors.bookTitle.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  errors.publisherName ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter publisher name"
                {...register("publisherName")}
              />
            </div>

            <div>
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
                  errors.publisherPlace ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="City, Country"
                {...register("publisherPlace")}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="authors"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contributing Authors <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="authors"
              className={`w-full px-3 py-2 border ${
                errors.authors ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter authors (separated by commas)"
              {...register("authors")}
            />
            {errors.authors && (
              <p className="mt-1 text-sm text-red-600">
                {errors.authors.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
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

            <div>
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
                  errors.edition ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="e.g., 2nd Edition"
                {...register("edition")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  errors.volume ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="e.g., Vol. 2"
                {...register("volume")}
              />
            </div>

            <div>
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
                  errors.medium ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="e.g., Print, E-book"
                {...register("medium")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                URL
              </label>
              <input
                type="text"
                id="url"
                className={`w-full px-3 py-2 border ${
                  errors.url ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="https://example.com/book"
                {...register("url")}
              />
              {errors.url && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.url.message}
                </p>
              )}
            </div>

            <div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Publication Date
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
                  {errors.date.message}
                </p>
              )}
            </div>

            <div>
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
                  errors.source ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="e.g., Library, Database name"
                {...register("source")}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            {/* Only show cancel button if onCancel has an actual function */}
            {onCancel !== (() => {}) && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                hasValidStyle
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-400 cursor-not-allowed"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              disabled={!hasValidStyle}
            >
              {hasValidStyle ? "Generate Citation" : "Select Style First"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
