// actions/generateCitation.ts
"use server";

import Cite from "citation-js";
import { CSLData } from "@/types/citation";
import { createClient } from "@/utils/supabase/server";
import { CitationFormData } from "@/types/schemas";

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

interface CSLAuthor {
  family?: string;
  given?: string;
  literal?: string;
}

export async function generateCitationFromText({
  data,
  formData,
  style = "apa",
  format = "html",
}: {
  data: CSLData;
  formData: CitationFormData;
  style?: string;
  format?: "html" | "text";
}) {
  console.log("Generating citation from text.......");

  // Save citation to Supabase
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("User not found");

  try {
    // Get the base URL from environment variable or construct it
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    console.log("Base URL:", baseUrl);

    // Fetch the CSL file from the public directory
    const cslResponse = await fetch(`${baseUrl}/csl/${style}.csl`);
    if (!cslResponse.ok) {
      throw new Error(`Failed to load citation style: ${style}`);
    }
    const cslFile = await cslResponse.text();

    const cite = new Cite(data);

    // Generate both citation formats in one go
    const [inTextCitation, bibliographyCitation] = await Promise.all([
      cite.format("citation", {
        format,
        template: style,
        templateFile: cslFile,
        lang: "en-US",
      }),
      cite.format("bibliography", {
        format,
        template: style,
        templateFile: cslFile,
        lang: "en-US",
      }),
    ]);

    // Save to Supabase with original form data
    const { error: dbError } = await supabase.from("citations").insert([
      {
        user_id: user.id,
        citation_data: {
          ...formData,
          style: style, // Add style to the form data
        },
        in_text_citation: inTextCitation,
        bibliography_citation: bibliographyCitation,
      },
    ]);

    if (dbError) throw dbError;

    return {
      inTextCitation,
      bibliographyCitation,
    };
  } catch (error: any) {
    console.error("Error in generateCitationFromText:", error);
    throw error;
  }
}
