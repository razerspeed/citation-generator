"use client";

import { useEffect, useState } from "react";
import { fetchCitations } from "@/actions/citations";
import { ReferencesList } from "@/components/styles/ReferencesList";

interface Citation {
  id: string;
  citation_data: any;
  in_text_citation: string;
  bibliography_citation: string;
  created_at: string;
}

export default function LibraryPage() {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCitations();
  }, []);

  const loadCitations = async () => {
    try {
      const { data, error } = await fetchCitations();
      if (error) throw new Error(error);
      if (!data) throw new Error("No data received");
      setCitations(data);
    } catch (err: any) {
      console.error("Error in loadCitations:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          Error loading citations: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ReferencesList
        references={citations}
        onDelete={loadCitations}
        title="My Citations Library"
        showBorder={false}
        showTopSpacing={false}
        onCitationSelect={(citation) => {
          // You can implement navigation to the citation editor here if needed
          console.log("Citation selected:", citation);
        }}
      />
    </div>
  );
}
