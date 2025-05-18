import React, { useState, useEffect } from "react";
import { Style } from "@/types/styles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  citationSchema,
  CitationFormData,
  BookCitationFormData,
} from "@/types/schemas";
import { BookForm } from "./citation-forms/BookForm";
import { JournalForm } from "./citation-forms/JournalForm";
import { WebpageForm } from "./citation-forms/WebpageForm";
import { CommonFields } from "./citation-forms/CommonFields";
import { toast } from "react-toastify";
import { generateCitationFromText } from "@/actions/generateCitation";
import { CSLData } from "@/types/citation";
import { formatDate, formatAuthor } from "@/utils/citation";
import { useCitation } from "@/contexts/CitationContext";

interface CitationFormProps {
  onSuccess?: () => void;
}

type CitationType = "book" | "journal" | "webpage";

export function CitationForm({ onSuccess }: CitationFormProps) {
  const { selectedStyle, formData, setFormData, setRenderedCitation } =
    useCitation();
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
      type: citationType,
      authors: "",
      editors: "",
      url: "",
      doi: "",
      date: "",
      ...(citationType === "book" && {
        bookTitle: "",
        publisherName: "",
        publisherPlace: "",
        edition: "",
        volume: "",
        medium: "",
        source: "",
      }),
      ...(citationType === "journal" && {
        articleTitle: "",
        journalName: "",
        volume: "",
        issue: "",
        pages: "",
        extra: "",
      }),
      ...(citationType === "webpage" && {
        articleTitle: "",
        websiteTitle: "",
        datePublished: "",
        dateAccessed: "",
        extra: "",
      }),
    },
  });

  // Effect to update form type when citation type changes
  useEffect(() => {
    setValue("type", citationType);
  }, [citationType, setValue]);

  // Update form when formData changes
  useEffect(() => {
    if (formData) {
      // Set the citation type
      setCitationType(formData.type as CitationType);

      // Reset form with formData
      reset(formData);

      // Set all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          setValue(key as keyof CitationFormData, value);
        }
      });
    }
  }, [formData, setValue, reset]);

  const onFormSubmit = async (data: CitationFormData) => {
    console.log("Form submitted with data:", data); // Debug log

    if (!selectedStyle) {
      toast.error(
        "Please select a citation style before generating a citation."
      );
      return;
    }

    try {
      // Transform the form data into the expected citation data format
      const citationData: CSLData = {
        // Core fields
        type: data.type,
        title: (() => {
          switch (data.type) {
            case "book":
              return data.bookTitle;
            case "webpage":
            case "journal":
              return data.articleTitle;
            default:
              return "";
          }
        })(),
        author: data.authors ? formatAuthor(data.authors) : undefined,

        // Publication fields
        "container-title": (() => {
          switch (data.type) {
            case "journal":
              return data.journalName;
            case "webpage":
              return data.websiteTitle;
            default:
              return undefined;
          }
        })(),

        // Optional fields based on type
        ...(data.type === "book" && {
          publisher: data.publisherName,
          "publisher-place": data.publisherPlace,
          edition: data.edition,
          volume: data.volume,
          medium: data.medium,
          source: data.source,
        }),

        ...(data.type === "journal" && {
          volume: data.volume,
          issue: data.issue,
          page: data.pages,
        }),

        // Common optional fields
        DOI: data.doi,
        URL: data.url,

        // Date fields
        issued: formatDate(data.date),
        ...(data.type === "webpage" && {
          accessed: formatDate(data.dateAccessed),
        }),
      };

      // Generate citation using the citation-js library
      const result = await generateCitationFromText({
        data: citationData,
        formData: data,
        style: selectedStyle.id,
        format: "text",
      });

      // Update context with both citations
      setRenderedCitation({
        inTextCitation: result.inTextCitation,
        bibliographyCitation: result.bibliographyCitation,
      });

      // Save form data to context
      setFormData(data);

      console.log("Generated citation:", result);
      toast.success("Citation generated successfully");

      // Call the onSuccess callback if provided
      onSuccess?.();
    } catch (err: any) {
      console.error("Error generating citation:", err);
      toast.error(err.message || "Failed to generate citation");
    }
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

  const handleReset = () => {
    // Create default values based on current citation type
    let defaultValues: CitationFormData;

    switch (citationType) {
      case "book":
        defaultValues = {
          type: "book",
          authors: "",
          editors: "",
          url: "",
          doi: "",
          date: "",
          bookTitle: "",
          publisherName: "",
          publisherPlace: "",
          edition: "",
          volume: "",
          medium: "",
          source: "",
        };
        break;

      case "journal":
        defaultValues = {
          type: "journal",
          authors: "",
          editors: "",
          url: "",
          doi: "",
          date: "",
          articleTitle: "",
          journalName: "",
          volume: "",
          issue: "",
          pages: "",
          extra: "",
        };
        break;

      case "webpage":
        defaultValues = {
          type: "webpage",
          authors: "",
          editors: "",
          url: "",
          doi: "",
          date: "",
          articleTitle: "",
          websiteTitle: "",
          datePublished: "",
          dateAccessed: "",
          extra: "",
        };
        break;

      default:
        defaultValues = {
          type: "book",
          authors: "",
          editors: "",
          url: "",
          doi: "",
          date: "",
          bookTitle: "",
          publisherName: "",
          publisherPlace: "",
          edition: "",
          volume: "",
          medium: "",
          source: "",
        };
    }

    reset(defaultValues);
    setFormData(null);
    setRenderedCitation(null);
  };

  return (
    <div className="bg-white h-full flex flex-col">
      {/* Citation Type Tabs */}
      <div className="flex border-b border-gray-200 mb-4 sticky top-0 bg-white z-10">
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

      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="flex flex-col h-full"
      >
        {/* Scrollable Form Fields */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-4 pl-1 pb-20">
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

          {/* Render form based on citation type */}
          {citationType === "book" && (
            <BookForm
              register={register}
              errors={errors}
              hasBookField={hasBookField}
              getFieldErrorMessage={getFieldErrorMessage}
            />
          )}

          {citationType === "journal" && (
            <JournalForm
              register={register}
              errors={errors}
              hasJournalField={hasJournalField}
              getFieldErrorMessage={getFieldErrorMessage}
            />
          )}

          {citationType === "webpage" && (
            <WebpageForm
              register={register}
              errors={errors}
              hasWebpageField={hasWebpageField}
              getFieldErrorMessage={getFieldErrorMessage}
            />
          )}

          {/* Common fields for all citation types */}
          <CommonFields
            register={register}
            errors={errors}
            citationType={citationType}
          />
        </div>

        {/* Submit Button - Fixed at bottom inside container */}
        <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              Reset
            </button>

            <button
              type="submit"
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white cursor-pointer ${
                hasValidStyle
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-400 cursor-not-allowed"
              }`}
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
