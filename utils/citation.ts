import { CSLDate } from "@/types/citation";

export const formatDate = (dateString?: string): CSLDate | undefined => {
  if (!dateString) return undefined;
  const parts = dateString.split("-").map(Number);
  return {
    "date-parts": [
      parts as [number] | [number, number] | [number, number, number],
    ],
  };
};

export const formatAuthor = (authorString: string) => {
  return authorString.split(",").map((author) => {
    const parts = author.trim().split(" ");
    if (parts.length >= 2) {
      return {
        family: parts[parts.length - 1],
        given: parts.slice(0, -1).join(" "),
      };
    }
    return { literal: author.trim() };
  });
};
