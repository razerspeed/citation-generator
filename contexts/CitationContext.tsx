"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Style } from "@/types/styles";
import { CitationFormData } from "@/types/schemas";

interface RenderedCitation {
  inTextCitation: string;
  bibliographyCitation: string;
}

interface CitationContextType {
  // Style-related state
  selectedStyle: Style | null;
  setSelectedStyle: (style: Style | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  // Form-related state
  formData: CitationFormData | null;
  setFormData: (data: CitationFormData | null) => void;
  selectedCitation: any | null;
  setSelectedCitation: (citation: any | null) => void;

  // Rendered citation state
  renderedCitation: RenderedCitation | null;
  setRenderedCitation: (citation: RenderedCitation | null) => void;
}

const CitationContext = createContext<CitationContextType | undefined>(
  undefined
);

export function CitationProvider({ children }: { children: ReactNode }) {
  // Style-related state
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Form-related state
  const [formData, setFormData] = useState<CitationFormData | null>(null);
  const [selectedCitation, setSelectedCitation] = useState<any | null>(null);

  // Rendered citation state
  const [renderedCitation, setRenderedCitation] =
    useState<RenderedCitation | null>(null);

  const value = {
    // Style-related state
    selectedStyle,
    setSelectedStyle,
    searchTerm,
    setSearchTerm,

    // Form-related state
    formData,
    setFormData,
    selectedCitation,
    setSelectedCitation,

    // Rendered citation state
    renderedCitation,
    setRenderedCitation,
  };

  return (
    <CitationContext.Provider value={value}>
      {children}
    </CitationContext.Provider>
  );
}

export function useCitation() {
  const context = useContext(CitationContext);
  if (context === undefined) {
    throw new Error("useCitation must be used within a CitationProvider");
  }
  return context;
}
