"use server";

import { createClient } from "@/utils/supabase/server";

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
