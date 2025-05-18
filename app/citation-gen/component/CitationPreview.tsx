import { fetchCitations } from "../action";
import { CopyButton } from "./utilityComponent/copyButton";

export async function CitationPreview({ id }: { id: string }) {
  // const { renderedCitation, selectedStyle } = useCitation();
  console.log("id", id);
  // let renderedCitation = "";
  let in_text_citation = "";
  let bibliography_citation = "";
  let selectedStyle = "";

  if (id) {
    // make a server action to get the rendered citation and selected style
    const { data, error } = await fetchCitations(id);
    // console.log("data", data);
    // console.log("error", error);
    if (data && Array.isArray(data) && data.length > 0) {
      in_text_citation = data[0].in_text_citation;
      bibliography_citation = data[0].bibliography_citation;
      selectedStyle = data[0].citation_data.style;
    }
    console.log("in_text_citation", in_text_citation);
    console.log("selectedStyle", selectedStyle);
  }

  if (!id) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
          </div>
          <p className="text-gray-500 text-lg">
            Your citation preview will appear here
          </p>
          <p className="text-gray-400 mt-2">
            Fill out the citation information to see the preview
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col">
        {/* Citation Style Badge */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-blue-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-blue-700 text-sm truncate">
                <span className="font-medium">Citation style:</span>{" "}
                {selectedStyle || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">In-text Citation:</h3>
              <CopyButton text={in_text_citation} type="inText" />
            </div>
            <div className="bg-gray-50 rounded-lg p-4 break-words">
              <p className="text-gray-700">{in_text_citation || ""}</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">Bibliography Entry:</h3>

              <CopyButton text={bibliography_citation} type="bibliography" />
            </div>
            <div className="bg-gray-50 rounded-lg p-4 break-words">
              <p className="text-gray-700">{bibliography_citation || ""}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
