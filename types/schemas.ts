import { z } from "zod";

// Custom date validator that accepts full ISO dates or just a year
const dateSchema = z.string().refine(
  (value) => {
    if (!value) return true; // Allow empty strings

    // Check if it's a valid year (1000-9999)
    const yearRegex = /^[1-9]\d{3}$/;
    if (yearRegex.test(value)) {
      // Additional check to ensure year is not more than 4 digits
      const yearNum = parseInt(value, 10);
      return yearNum >= 1000 && yearNum <= 9999;
    }

    // Check if it's a valid ISO date format
    try {
      const date = new Date(value);
      // Verify this is actually a valid date and not something that gets coerced
      if (isNaN(date.getTime())) return false;

      // Additional validation for reasonable date range
      const year = date.getFullYear();
      return year >= 1000 && year <= 9999;
    } catch {
      return false;
    }
  },
  {
    message:
      "Date must be a valid year (e.g., 1990) or a valid date format (e.g., 2023-05-15)",
  }
);

// Base citation schema with common fields
const baseCitationSchema = z.object({
  authors: z.string().min(1, { message: "At least one author is required" }),
  editors: z.string().optional(),
  url: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
  doi: z.string().optional(),
  date: dateSchema.optional(),
});

// Book citation schema
export const bookCitationSchema = baseCitationSchema.extend({
  type: z.literal("book"),
  bookTitle: z.string().min(1, { message: "Book title is required" }),
  publisherName: z.string().optional(),
  publisherPlace: z.string().optional(),
  edition: z.string().optional(),
  volume: z.string().optional(),
  medium: z.string().optional(),
  source: z.string().optional(),
});

// Journal article citation schema
export const journalArticleSchema = baseCitationSchema.extend({
  type: z.literal("journal"),
  articleTitle: z.string().min(1, { message: "Article title is required" }),
  journalName: z.string().min(1, { message: "Journal name is required" }),
  volume: z.string().optional(),
  issue: z.string().optional(),
  pages: z.string().optional(),
  publisherName: z.string().optional(),
  extra: z.string().optional(),
});

// Webpage citation schema
export const webpageSchema = baseCitationSchema.extend({
  type: z.literal("webpage"),
  articleTitle: z.string().min(1, { message: "Article title is required" }),
  websiteTitle: z.string().min(1, { message: "Website title is required" }),
  dateAccessed: dateSchema.optional(),
  datePublished: dateSchema.optional(),
  extra: z.string().optional(),
});

// Combined citation schema using discriminated union
export const citationSchema = z.discriminatedUnion("type", [
  bookCitationSchema,
  journalArticleSchema,
  webpageSchema,
]);

// Type for all citation form data
export type CitationFormData = z.infer<typeof citationSchema>;

// Types for specific citation types
export type BookCitationFormData = z.infer<typeof bookCitationSchema>;
export type JournalArticleFormData = z.infer<typeof journalArticleSchema>;
export type WebpageFormData = z.infer<typeof webpageSchema>;

// Add other schemas as needed
