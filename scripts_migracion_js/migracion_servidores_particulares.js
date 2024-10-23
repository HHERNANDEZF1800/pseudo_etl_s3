const fs = require("fs").promises;
const path = require("path");

// Define input and output paths
const inputDir = "../pruebas/datos_entrada/s3p/CHIAPAS/data-0000000001.json";
const outputDir = "../pruebas/datos_salida/";

async function processJsonFile() {
  try {
    // Create output directory if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true });

    try {
      // Read and parse JSON file
      const fileContent = await fs.readFile(inputDir, "utf8");
      const jsonData = JSON.parse(fileContent);

      // Convert to array if single object
      const records = Array.isArray(jsonData) ? jsonData : [jsonData];

      // Analyze each record in the file
      const results = records.map((record) => {
        const fileType = determineFileType(record);
        return {
          fileName: path.basename(inputDir),
          type: fileType,
          id: record.id || "N/A",
        };
      });

      // Get original filename and use it for output
      const originalFileName = path.basename(inputDir);
      const outputFile = path.join(outputDir, originalFileName);

      // Write results to output file
      await fs.writeFile(outputFile, JSON.stringify(results, null, 2));

      console.log(`Processed ${originalFileName} successfully`);
    } catch (fileError) {
      console.error(`Error processing file:`, fileError.message);
    }
  } catch (error) {
    console.error("Error processing files:", error.message);
    throw error;
  }
}

function determineFileType(record) {
  if (record.particularSancionado) {
    return "PARTICULAR_SANCIONADO";
  } else if (record.servidorPublicoSancionado) {
    return "SERVIDOR_PUBLICO_SANCIONADO";
  } else {
    return "UNKNOWN";
  }
}

// Main execution
async function main() {
  try {
    await processJsonFile();
    console.log("Processing completed successfully");
  } catch (error) {
    console.error("Script execution failed:", error.message);
    process.exit(1);
  }
}

// Run the script
main();
