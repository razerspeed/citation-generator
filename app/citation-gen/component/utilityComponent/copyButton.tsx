"use client";
import { Copy, CheckCircle2 } from "lucide-react";

import { useState } from "react";

export function CopyButton({
  text,
  type,
}: {
  text: string;
  type: "inText" | "bibliography";
}) {
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleCopy = async (text: string, type: "inText" | "bibliography") => {
    try {
      // Remove HTML tags from the text
      const cleanText = text.replace(/<[^>]*>/g, "");
      await navigator.clipboard.writeText(cleanText);
      setCopiedStates({ ...copiedStates, [type]: true });
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <button
      onClick={() => handleCopy(text, type)}
      className="text-purple-600 hover:text-purple-700 p-2 rounded-full hover:bg-purple-50 transition-colors"
    >
      {copiedStates[type] ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );
}
