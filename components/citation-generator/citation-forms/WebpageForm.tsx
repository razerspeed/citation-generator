import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CitationFormData } from "@/types/schemas";

interface WebpageFormProps {
  register: UseFormRegister<CitationFormData>;
  errors: FieldErrors<CitationFormData>;
  hasWebpageField: (fieldName: string) => boolean;
  getFieldErrorMessage: (fieldName: string) => string | undefined;
}

export function WebpageForm({
  register,
  errors,
  hasWebpageField,
  getFieldErrorMessage,
}: WebpageFormProps) {
  return (
    <>
      <div>
        <label
          htmlFor="url"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          URL <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="url"
          className={`w-full px-3 py-2 border ${
            hasWebpageField("url") ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="https://example.com/"
          {...register("url")}
        />
        {hasWebpageField("url") && (
          <p className="mt-1 text-sm text-red-600">
            {getFieldErrorMessage("url")}
          </p>
        )}
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
            hasWebpageField("extra") ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Additional information"
          {...register("extra")}
        />
      </div>
    </>
  );
}
