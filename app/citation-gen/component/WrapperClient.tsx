"use client";

import { useEffect } from "react";
import { StyleSearch } from "./StyleSearch";
import { CitationForm } from "./CitationForm";
import { CitationProvider, useCitation } from "@/contexts/CitationContext";

function StylesPageContent() {
  const { selectedStyle, selectedCitation } = useCitation();

  // Effect to handle scrolling when style is selected
  useEffect(() => {
    if (selectedStyle) {
      // Wait for the next tick to ensure the citation form is rendered
      setTimeout(() => {
        const citationForm = document.querySelector(".citation-form");
        if (citationForm) {
          citationForm.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [selectedStyle]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 mb-8 relative z-20">
        <h1 className="text-3xl font-bold text-center mb-2">
          Comprehensive Citation Generator
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Generate accurate citations in seconds
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <StyleSearch />
        </div>
      </div>

      {/* Show placeholder when no style is selected */}
      <div className="relative z-10">
        {!selectedStyle && !selectedCitation ? (
          <div className="mb-12 text-center py-16 rounded-xl border border-purple-100">
            <svg
              className="mx-auto h-12 w-12 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              Ready to Create Citations
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Choose a citation style above or select a saved citation below to
              get started
            </p>
          </div>
        ) : (
          /* Citation Form and Preview */
          <div
            id="citation-section"
            className="mb-8 citation-form bg-white rounded-xl border border-gray-200 p-8 shadow-sm"
          >
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Citation Form */}
              <div className="flex-1 lg:w-1/2 w-full bg-white rounded-lg border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-purple-800 mb-2">
                    Citation Information
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Enter the details for your citation.
                  </p>
                </div>

                <div className="h-[500px]">
                  <CitationForm onSuccess={() => {}} />
                </div>
              </div>

              {/* Right Column - Citation Preview */}
              {/* <div className="flex-1 lg:w-1/2 w-full bg-white rounded-lg border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-purple-800 mb-2">
                    Citation Preview
                  </h2>
                  <p className="text-gray-600 mb-4">
                    This is how your citation will appear.
                  </p>
                </div>

                <div className="h-[500px] overflow-y-auto px-6">
                  <CitationPreview />
                </div>
              </div> */}
            </div>
          </div>
        )}
      </div>

      {/* References List */}
      {/* <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
          </div>
        ) : references.length > 0 ? (
          <ReferencesList references={references} onDelete={loadReferences} />
        ) : (
          <ReferencesList references={[]} onDelete={loadReferences} />
        )}
      </div> */}
    </div>
  );
}

export default function StylesPage() {
  return (
    <CitationProvider>
      <StylesPageContent />
    </CitationProvider>
  );
}
