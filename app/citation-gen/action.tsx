"use server";

import { createClient } from "@/utils/supabase/server";

export async function fetchCitations(id: string) {
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
      .eq("id", id)
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

// actions/generateCitation.ts

import Cite from "citation-js";
import { CSLData } from "@/types/citation";
import { CitationFormData } from "@/types/schemas";
import { redirect } from "next/navigation";

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

  let redirectId: any;

  try {
    // Get the base URL from environment variable or construct it
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    // console.log("Base URL:", baseUrl);

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

    // // Save to Supabase with original form data and also get the saved data back

    let { data: savedData, error: dbError } = await supabase
      .from("citations")
      .insert([
        {
          user_id: user.id,
          citation_data: {
            ...formData,
            style: style,
          },
          in_text_citation: inTextCitation,
          bibliography_citation: bibliographyCitation,
        },
      ])
      .select()
      .single();

    redirectId = savedData.id;

    console.log("savedData id", savedData.id);
    if (dbError) throw dbError;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      console.log("NEXT_REDIRECT");

      return { success: true };
    }

    console.error("Error in generateCitationFromText:", error);
    throw error;
  }
  console.log("redirectId", redirectId);

  return redirect(`/citation-gen?q=${redirectId}`);
}
