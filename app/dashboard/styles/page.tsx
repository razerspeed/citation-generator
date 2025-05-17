"use client";

import { useEffect, useState } from "react";
import styles from "@/data/csl-styles.json";
import { StyleSearch } from "@/components/styles/StyleSearch";
import { CitationForm } from "@/components/styles/CitationForm";
import { CitationPreview } from "@/components/styles/CitationPreview";
import { ReferencesList } from "@/components/styles/ReferencesList";
import { Style } from "@/types/styles";
import { CitationFormData } from "@/types/schemas";
import { fetchCitations, createCitation } from "@/actions/citations";
import { toast } from "react-toastify";

export default function StylesPage() {
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [formData, setFormData] = useState<CitationFormData | null>(null);
  const [references, setReferences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCitation, setSelectedCitation] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    loadReferences();
  }, []);

  // Load references from the database
  const loadReferences = async () => {
    try {
      // Fetch citations from the database using server actions
      const { data, error } = await fetchCitations();
      if (error) throw new Error(error);
      setReferences(data || []);
    } catch (err) {
      console.error("Error loading references:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle style selection from the search bar
  const handleStyleSelect = (style: Style) => {
    setSelectedStyle(style);
    setSearchTerm(style.name);

    // Wait for the next tick to ensure the citation form is rendered
    setTimeout(() => {
      const citationForm = document.querySelector(".citation-form");
      if (citationForm) {
        // Scroll to the citation form
        citationForm.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleCitationSelect = (citation: any) => {
    // Find the style that matches the citation's style
    const style = styles.find((s) => s.name === citation.citation_data.style);
    if (style) {
      setSelectedStyle(style);
      setSearchTerm(style.name);
    }

    setSelectedCitation(citation);

    // Transform the citation data back into form data format based on type
    const baseFormData = {
      type: citation.citation_data.type,
      authors: citation.citation_data.authors?.[0] || "",
      url: citation.citation_data.url || "",
      doi: citation.citation_data.doi || "",
      date: citation.citation_data.year
        ? `${citation.citation_data.year}-01-01`
        : "",
    };

    let newFormData: CitationFormData;

    switch (citation.citation_data.type) {
      case "journal":
        newFormData = {
          ...baseFormData,
          articleTitle: citation.citation_data.title || "",
          journalName: citation.citation_data.journal || "",
          volume: citation.citation_data.volume || "",
          issue: citation.citation_data.issue || "",
          pages: citation.citation_data.pages || "",
        };
        break;

      case "book":
        newFormData = {
          ...baseFormData,
          bookTitle: citation.citation_data.title || "",
          publisherName: citation.citation_data.publisher || "",
          edition: citation.citation_data.edition || "",
          editors: citation.citation_data.editors || "",
        };
        break;

      case "webpage":
        newFormData = {
          ...baseFormData,
          articleTitle: citation.citation_data.title || "",
          websiteTitle: citation.citation_data.websiteTitle || "",
          datePublished: citation.citation_data.datePublished || "",
          dateAccessed: citation.citation_data.dateAccessed || "",
        };
        break;

      default:
        newFormData = baseFormData as CitationFormData;
    }

    setFormData(newFormData);

    // Wait for the next tick to ensure the citation form is rendered
    setTimeout(() => {
      const citationForm = document.querySelector(".citation-form");
      if (citationForm) {
        citationForm.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleSubmit = async (data: CitationFormData) => {
    if (!selectedStyle) {
      toast.error(
        "Please select a citation style before generating a citation."
      );
      return;
    }

    setFormData(data);
    setSelectedCitation(null); // Clear selected citation when generating new one

    try {
      // Transform the form data into the expected citation data format
      const citationData = {
        // Common fields
        authors: data.authors ? [data.authors] : undefined,
        url: data.url,
        doi: data.doi,
        type: data.type,
        style: selectedStyle.name,

        // Title field based on type
        title: (() => {
          switch (data.type) {
            case "book":
              return data.bookTitle;
            case "webpage":
              return data.articleTitle;
            case "journal":
              return data.articleTitle;
            default:
              return "";
          }
        })(),

        // Additional fields based on type
        ...(data.type === "journal" && {
          journal: data.journalName,
          volume: data.volume,
          issue: data.issue,
          pages: data.pages,
          year: data.date?.split("-")[0],
        }),

        ...(data.type === "book" && {
          publisher: data.publisherName,
          year: data.date?.split("-")[0],
        }),

        ...(data.type === "webpage" && {
          websiteTitle: data.websiteTitle,
          datePublished: data.datePublished,
          dateAccessed: data.dateAccessed,
        }),
      };

      // Create the citation in the database using server actions
      const { error } = await createCitation(citationData);
      if (error) throw new Error(error);

      toast.success("Citation generated and saved successfully");

      // Reload the references list
      await loadReferences();
    } catch (err: any) {
      console.error("Error creating citation:", err);
      toast.error(err.message || "Failed to save citation");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          Comprehensive Citation Generator
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Generate accurate citations in seconds
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <StyleSearch
            styles={styles}
            onSelectStyle={handleStyleSelect}
            selectedStyleId={selectedStyle?.id}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
          />
          <div className="text-sm text-gray-500 mt-2 text-center">
            {styles.length} citation styles available
          </div>
        </div>
      </div>

      {/* Show placeholder when no style is selected */}
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
            <div className="flex-1 lg:w-1/2 w-full bg-white rounded-lg border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-purple-800 mb-2">
                Citation Information
              </h2>
              <p className="text-gray-600 mb-6">
                Enter the details for your citation.
              </p>

              <div className="min-h-[600px]">
                <CitationForm
                  selectedStyle={
                    selectedStyle || {
                      id: "",
                      name: "No style selected",
                      filename: "",
                    }
                  }
                  onCancel={() => {}}
                  onSubmit={handleSubmit}
                  initialData={formData}
                />
              </div>
            </div>

            {/* Right Column - Citation Preview */}
            <div className="flex-1 lg:w-1/2 w-full bg-white rounded-lg border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-purple-800 mb-2">
                Citation Preview
              </h2>
              <p className="text-gray-600 mb-6">
                This is how your citation will appear.
              </p>

              <div className="min-h-[600px]">
                <CitationPreview
                  formData={formData}
                  selectedStyle={selectedStyle}
                  existingCitation={selectedCitation}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* References List */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
          </div>
        ) : references.length > 0 ? (
          <ReferencesList
            references={references}
            onCitationSelect={handleCitationSelect}
            onDelete={loadReferences}
          />
        ) : (
          <ReferencesList
            references={[]}
            onCitationSelect={handleCitationSelect}
            onDelete={loadReferences}
          />
        )}
      </div>
    </div>
  );
}
