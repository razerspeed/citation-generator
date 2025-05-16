// "use server";

// import Cite from "citation-js";
// import fs from "fs/promises";
// import path from "path";

// export async function generateCitationFromText({
//   data,
//   style = "apa",
//   format = "html",
// }: {
//   data: any;
//   style?: string;
//   format?: "html" | "text";
// }) {
//   console.log("Generating citation from text.......");
//   // const cslPath = path.join(process.cwd(), "csl", `${style}.csl`);
//   const cslPath = path.join(process.cwd(), "public", "csl", `${style}.csl`);
//   const cslFile = await fs.readFile(cslPath, "utf-8");

//   const cite = new Cite(data);

//   // Generate both citation formats in one go
//   const [inTextCitation, bibliographyCitation] = await Promise.all([
//     cite.format("citation", {
//       format,
//       template: style,
//       templateFile: cslFile,
//       lang: "en-US",
//     }),
//     cite.format("bibliography", {
//       format,
//       template: style,
//       templateFile: cslFile,
//       lang: "en-US",
//     }),
//   ]);

//   return {
//     inTextCitation,
//     bibliographyCitation,
//   };
// }

// actions/generateCitation.ts
"use server";

import Cite from "citation-js";

export async function generateCitationFromText({
  data,
  style = "apa",
  format = "html",
}: {
  data: any;
  style?: string;
  format?: "html" | "text";
}) {
  console.log("Generating citation from text.......");

  // Get the base URL from environment variable or construct it
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

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

  return {
    inTextCitation,
    bibliographyCitation,
  };
}
