import React, { useEffect, useState } from "react";
import { Style } from "@/types/styles";
import { CitationFormData } from "@/types/schemas";
import { generateCitationFromText } from "@/actions/generateCitation";
import { Copy, CheckCircle2 } from "lucide-react";

interface CitationPreviewProps {
  formData: CitationFormData | null;
  selectedStyle: Style | null;
  existingCitation?: {
    in_text_citation: string;
    bibliography_citation: string;
    citation_data?: {
      style?: string;
    };
  } | null;
}

export function CitationPreview({
  formData,
  selectedStyle,
  existingCitation,
}: CitationPreviewProps) {
  const [citation, setCitation] = useState<string>("");
  const [bibliography, setBibliography] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleCopy = async (text: string, type: "inText" | "bibliography") => {
    try {
      // Remove HTML tags from the text
      const cleanText = text.replace(/<[^>]*>/g, "");
      await navigator.clipboard.writeText(cleanText);
      setCopiedStates({ ...copiedStates, [type]: true });
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  useEffect(() => {
    // If we have an existing citation, use that instead of generating new ones
    if (existingCitation) {
      setCitation(existingCitation.in_text_citation);
      setBibliography(existingCitation.bibliography_citation);
      return;
    }

    async function generateCitations() {
      if (!formData || !selectedStyle?.id) return;

      // Check for required fields based on citation type
      if (
        (formData.type === "book" &&
          (!formData.bookTitle || !formData.authors)) ||
        (formData.type === "journal" &&
          (!formData.articleTitle ||
            !formData.journalName ||
            !formData.authors)) ||
        (formData.type === "webpage" &&
          (!formData.articleTitle ||
            !formData.websiteTitle ||
            !formData.authors))
      ) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Prepare authors and editors data
        const prepareNames = (names: string) => {
          return names.split(",").map((name) => {
            const nameParts = name.trim().split(" ");
            const given = nameParts.slice(0, -1).join(" ");
            const family = nameParts.slice(-1)[0];
            return { given, family };
          });
        };

        // Common CSL data fields for all types
        const commonData = {
          author: formData.authors ? prepareNames(formData.authors) : undefined,
          editor: formData.editors ? prepareNames(formData.editors) : undefined,
          URL: formData.url || undefined,
          DOI: formData.doi || undefined,
          issued: formData.date
            ? { "date-parts": [[formData.date]] }
            : undefined,
        };

        // Prepare citation data in CSL-JSON format based on type
        let cslData: any;

        switch (formData.type) {
          case "book":
            cslData = {
              ...commonData,
              type: "book",
              title: formData.bookTitle,
              publisher: formData.publisherName || undefined,
              "publisher-place": formData.publisherPlace || undefined,
              edition: formData.edition || undefined,
              volume: formData.volume || undefined,
              medium: formData.medium || undefined,
              source: formData.source || undefined,
            };
            break;

          case "journal":
            cslData = {
              ...commonData,
              type: "article-journal",
              title: formData.articleTitle,
              "container-title": formData.journalName,
              volume: formData.volume || undefined,
              issue: formData.issue || undefined,
              page: formData.pages || undefined,
              publisher: formData.publisherName || undefined,
              note: formData.extra || undefined,
            };
            break;

          case "webpage":
            cslData = {
              ...commonData,
              type: "webpage",
              title: formData.articleTitle,
              "container-title": formData.websiteTitle,
              accessed: formData.dateAccessed
                ? { "date-parts": [[formData.dateAccessed]] }
                : undefined,
              issued: formData.datePublished
                ? { "date-parts": [[formData.datePublished]] }
                : formData.date
                ? { "date-parts": [[formData.date]] }
                : undefined,
              note: formData.extra || undefined,
            };
            break;
        }

        // Generate both citations in one call
        const { inTextCitation, bibliographyCitation } =
          await generateCitationFromText({
            data: cslData,
            style: selectedStyle.id,
            format: "html",
          });

        setCitation(inTextCitation);
        setBibliography(bibliographyCitation);
      } catch (err) {
        console.error("Error generating citation:", err);
        setError("Failed to generate citation. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    generateCitations();
  }, [formData, selectedStyle]);

  if (!formData && !existingCitation) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
          </div>
          <p className="text-gray-500 text-lg">
            Your citation preview will appear here
          </p>
          <p className="text-gray-400 mt-2">
            Fill out the citation information to see the preview
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Generating citation...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4 border border-red-200 rounded bg-red-50">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Citation Style Badge */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-blue-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-blue-700 text-sm truncate">
                  <span className="font-medium">Citation style:</span>{" "}
                  {existingCitation?.citation_data?.style ||
                    selectedStyle?.name ||
                    "Not specified"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-8 overflow-y-auto">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-lg">In-text Citation:</h3>
                <button
                  onClick={() => handleCopy(citation, "inText")}
                  className="text-purple-600 hover:text-purple-700 p-2 rounded-full hover:bg-purple-50 transition-colors"
                >
                  {copiedStates["inText"] ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 break-words">
                <p
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: citation }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-lg">Bibliography Entry:</h3>
                <button
                  onClick={() => handleCopy(bibliography, "bibliography")}
                  className="text-purple-600 hover:text-purple-700 p-2 rounded-full hover:bg-purple-50 transition-colors"
                >
                  {copiedStates["bibliography"] ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 break-words">
                <p
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: bibliography }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
