export interface Reference {
  id: string;
  citation_data: {
    title: string;
    type: string;
    style: string;
    authors?: string[];
    year?: string;
    journal?: string;
    volume?: string;
    issue?: string;
    pages?: string;
    doi?: string;
    url?: string;
    publisher?: string;
  };
  in_text_citation: string;
  bibliography_citation: string;
  created_at: string;
}
