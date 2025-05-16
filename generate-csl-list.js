const fs = require("fs").promises;
const path = require("path");

async function generateCslList() {
  try {
    // Read all files from the csl directory
    const files = await fs.readdir(path.join(process.cwd(), "csl"));

    // Filter only .csl files and create an array of objects with name and id
    const cslFiles = files
      .filter((file) => file.endsWith(".csl"))
      .map((file) => ({
        id: file.replace(".csl", ""),
        name: file
          .replace(".csl", "")
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        filename: file,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), "data");
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir);
    }

    // Write the JSON file - without the nested "styles" object
    await fs.writeFile(
      path.join(dataDir, "csl-styles.json"),
      JSON.stringify(cslFiles, null, 2)
    );

    console.log(
      `Successfully generated csl-styles.json with ${cslFiles.length} styles`
    );
  } catch (error) {
    console.error("Error generating CSL list:", error);
    process.exit(1);
  }
}

generateCslList();
