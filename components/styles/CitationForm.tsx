import React, { useState, useEffect } from "react";
import { Style } from "@/types/styles";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  citationSchema,
  CitationFormData,
  BookCitationFormData,
  JournalArticleFormData,
  WebpageFormData,
} from "@/types/schemas";

interface CitationFormProps {
  selectedStyle: Style;
  onCancel: () => void;
  onSubmit: (data: CitationFormData) => void;
  initialData?: CitationFormData | null;
}

type CitationType = "book" | "journal" | "webpage";

export function CitationForm({
  selectedStyle,
  onCancel,
  onSubmit,
  initialData,
}: CitationFormProps) {
  const [citationType, setCitationType] = useState<CitationType>("book");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<CitationFormData>({
    resolver: zodResolver(citationSchema),
    defaultValues: {
      type: "book",
      authors: "",
      editors: "",
      url: "",
      doi: "",
      date: "",
      // Book specific
      bookTitle: "",
      publisherName: "",
      publisherPlace: "",
      edition: "",
      volume: "",
      medium: "",
      source: "",
    } as BookCitationFormData,
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      // Set the citation type
      setCitationType(initialData.type as CitationType);

      // Reset form with initial data
      reset(initialData);

      // Set all form fields
      Object.entries(initialData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          setValue(key as keyof CitationFormData, value);
        }
      });
    }
  }, [initialData, setValue, reset]);

  const onFormSubmit = (data: CitationFormData) => {
    onSubmit(data);
  };

  // Check if a style is properly selected
  const hasValidStyle = selectedStyle && selectedStyle.id !== "";

  // Handle citation type change
  const handleTypeChange = (type: CitationType) => {
    setCitationType(type);
    setValue("type", type);
  };

  // Type guard functions for checking specific form types and errors
  const hasBookField = (fieldName: string): boolean => {
    return citationType === "book" && fieldName in errors;
  };

  const hasJournalField = (fieldName: string): boolean => {
    return citationType === "journal" && fieldName in errors;
  };

  const hasWebpageField = (fieldName: string): boolean => {
    return citationType === "webpage" && fieldName in errors;
  };

  const getFieldErrorMessage = (fieldName: string): string | undefined => {
    if (fieldName in errors) {
      const error = errors[fieldName as keyof typeof errors];
      return error?.message;
    }
    return undefined;
  };

  return (
    <div className="bg-white border border-gray-300 rounded-md shadow-md p-6">
      {/* Citation Type Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          type="button"
          className={`py-2 px-4 font-medium text-sm ${
            citationType === "book"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleTypeChange("book")}
        >
          Book
        </button>
        <button
          type="button"
          className={`py-2 px-4 font-medium text-sm ${
            citationType === "journal"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleTypeChange("journal")}
        >
          Journal Article
        </button>
        <button
          type="button"
          className={`py-2 px-4 font-medium text-sm ${
            citationType === "webpage"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleTypeChange("webpage")}
        >
          Webpage
        </button>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="space-y-4">
          {/* Common author field for all citation types */}
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
                {errors.authors?.message}
              </p>
            )}
          </div>

          {/* Book specific fields */}
          {citationType === "book" && (
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
                    hasBookField("bookTitle")
                      ? "border-red-500"
                      : "border-gray-300"
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
                      hasBookField("publisherName")
                        ? "border-red-500"
                        : "border-gray-300"
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
                      hasBookField("publisherPlace")
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="City, Country"
                    {...register("publisherPlace")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      hasBookField("edition")
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="e.g., 2nd Edition"
                    {...register("edition")}
                  />
                </div>

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
                      hasBookField("volume")
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="e.g., Vol. 2"
                    {...register("volume")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      hasBookField("medium")
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="e.g., Print, E-book"
                    {...register("medium")}
                  />
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
                      hasBookField("source")
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="e.g., Library, Database name"
                    {...register("source")}
                  />
                </div>
              </div>
            </>
          )}

          {/* Journal article specific fields */}
          {citationType === "journal" && (
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      hasJournalField("volume")
                        ? "border-red-500"
                        : "border-gray-300"
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
                      hasJournalField("issue")
                        ? "border-red-500"
                        : "border-gray-300"
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
                      hasJournalField("pages")
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="e.g., 123-145"
                    {...register("pages")}
                  />
                </div>
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
                      hasJournalField("extra")
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Additional information"
                    {...register("extra")}
                  />
                </div>
              </div>
            </>
          )}

          {/* Webpage specific fields */}
          {citationType === "webpage" && (
            <>
              <div>
                <label
                  htmlFor="articleTitle"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Article Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="articleTitle"
                  className={`w-full px-3 py-2 border ${
                    hasWebpageField("articleTitle")
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter article title"
                  {...register("articleTitle")}
                />
                {hasWebpageField("articleTitle") && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldErrorMessage("articleTitle")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="websiteTitle"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Website Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="websiteTitle"
                  className={`w-full px-3 py-2 border ${
                    hasWebpageField("websiteTitle")
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter website title"
                  {...register("websiteTitle")}
                />
                {hasWebpageField("websiteTitle") && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldErrorMessage("websiteTitle")}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="datePublished"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Date Published
                  </label>
                  <input
                    type="text"
                    id="datePublished"
                    className={`w-full px-3 py-2 border ${
                      hasWebpageField("datePublished")
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="YYYY-MM-DD or YYYY"
                    {...register("datePublished")}
                  />
                  {hasWebpageField("datePublished") && (
                    <p className="mt-1 text-sm text-red-600">
                      {getFieldErrorMessage("datePublished")}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="dateAccessed"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Date Accessed
                  </label>
                  <input
                    type="text"
                    id="dateAccessed"
                    className={`w-full px-3 py-2 border ${
                      hasWebpageField("dateAccessed")
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="YYYY-MM-DD"
                    {...register("dateAccessed")}
                  />
                  {hasWebpageField("dateAccessed") && (
                    <p className="mt-1 text-sm text-red-600">
                      {getFieldErrorMessage("dateAccessed")}
                    </p>
                  )}
                </div>
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
                    hasWebpageField("extra")
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Additional information"
                  {...register("extra")}
                />
              </div>
            </>
          )}

          {/* Common fields for all citation types */}
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                URL{" "}
                {citationType === "webpage" && (
                  <span className="text-red-500">*</span>
                )}
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
                <p className="mt-1 text-sm text-red-600">
                  {errors.url?.message}
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
