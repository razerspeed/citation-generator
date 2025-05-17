"use server";

import { createClient } from "@/utils/supabase/server";

interface CitationData {
  title: string;
  authors?: string[];
  year?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
  publisher?: string;
  type: string;
  style: string;
}

interface Citation {
  user_id: string;
  citation_data: CitationData;
  in_text_citation: string;
  bibliography_citation: string;
}

export async function fetchCitations() {
  console.log("Fetching citations.......");
  try {
    const supabase = await createClient();
    console.log("Supabase client created successfully");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Auth error:", userError);
      throw new Error("Authentication failed");
    }

    if (!user) {
      console.error("No user found");
      throw new Error("User not found");
    }

    console.log("Authenticated user ID:", user.id);

    const { data, error } = await supabase
      .from("citations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database query error:", error);
      throw error;
    }

    return { data, error: null };
  } catch (error: any) {
    console.error("Error in fetchCitations:", error);
    return {
      data: null,
      error: error.message || "Failed to fetch citations",
    };
  }
}

export async function deleteCitation(id: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from("citations").delete().eq("id", id);

    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error("Error deleting citation:", error);
    return { error: error.message };
  }
}

export async function createCitation(citationData: CitationData) {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error("User not found");

    // Generate citations based on the style and data
    const inTextCitation = generateInTextCitation(citationData);
    const bibliographyCitation = generateBibliographyCitation(citationData);

    const citation: Citation = {
      user_id: user.id,
      citation_data: citationData,
      in_text_citation: inTextCitation,
      bibliography_citation: bibliographyCitation,
    };

    const { data, error } = await supabase
      .from("citations")
      .insert([citation])
      .select()
      .single();

    console.log("Citation created successfully");
    console.log("Citation error", error);
    if (error) throw error;

    return { data, error: null };
  } catch (error: any) {
    console.error("Error creating citation:", error);
    return {
      data: null,
      error: error.message || "Failed to create citation",
    };
  }
}

export async function deleteSelectedCitations(ids: string[]) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from("citations").delete().in("id", ids);

    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error("Error deleting citations:", error);
    return { error: error.message };
  }
}

// Helper functions to generate citations
function generateInTextCitation(data: CitationData): string {
  // Get the first author's name and extract the last name
  const authorName = data.authors?.[0] || "Author";
  const lastName = authorName.split(" ").pop() || authorName;
  const year = data.year || "n.d.";
  return `(${lastName.toLowerCase()}, ${year})`;
}

function generateBibliographyCitation(data: CitationData): string {
  // This is a simple example - you should implement proper citation formatting based on the style
  const authors = data.authors?.join(", ") || "Author";
  const year = data.year || "n.d.";
  const title = data.title || "";
  const journal = data.journal ? `${data.journal}.` : "";
  const volume = data.volume ? `${data.volume}` : "";
  const issue = data.issue ? `(${data.issue})` : "";
  const pages = data.pages ? `, ${data.pages}` : "";

  return `${authors}. (${year}). ${title}. ${journal} ${volume}${issue}${pages}`.trim();
}
