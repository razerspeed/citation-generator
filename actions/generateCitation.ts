"use server";

import Cite from "citation-js";
import fs from "fs/promises";
import path from "path";

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
  const cslPath = path.join(process.cwd(), "csl", `${style}.csl`);
  const cslFile = await fs.readFile(cslPath, "utf-8");

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
