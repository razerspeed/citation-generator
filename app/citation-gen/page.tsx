import StylesPage from "./component/WrapperClient";
import { CitationPreview } from "./component/CitationPreview";
import { Suspense } from "react";

// Add metadata for caching
export const dynamic = "force-dynamic"; // Ensures the page is dynamic but components can still be cached
export const revalidate = 3600; // Revalidate cache every hour

export default async function CitationGeneratorPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const id = (await searchParams)?.q || "";

  return (
    <div className="max-w-3xl mx-auto">
      <StylesPage />

      {/* use suspense to load the citation preview */}
      <Suspense fallback={<div>Loading...</div>}>
        <CitationPreview id={id} />
      </Suspense>
    </div>
  );
}
