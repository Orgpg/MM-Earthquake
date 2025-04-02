/**
 * Extracts data from a Tableau visualization using the Tableau JavaScript API
 * This is a simplified example and would need to be adapted to your specific Tableau dashboard
 */
export async function extractTableauData(vizUrl) {
  return new Promise((resolve, reject) => {
    try {
      // Load the Tableau JavaScript API if not already loaded
      if (!window.tableau) {
        const script = document.createElement("script");
        script.src =
          "https://public.tableau.com/javascripts/api/tableau-2.min.js";
        script.onload = () => initTableau(vizUrl, resolve, reject);
        script.onerror = () => reject(new Error("Failed to load Tableau API"));
        document.head.appendChild(script);
      } else {
        initTableau(vizUrl, resolve, reject);
      }
    } catch (error) {
      reject(error);
    }
  });
}

function initTableau(vizUrl, resolve, reject) {
  try {
    // Create a placeholder div for the viz
    const placeholderDiv = document.createElement("div");
    placeholderDiv.style.display = "none";
    document.body.appendChild(placeholderDiv);

    // Initialize the viz
    const viz = new window.tableau.Viz(placeholderDiv, vizUrl, {
      hideTabs: true,
      hideToolbar: true,
      onFirstInteractive: () => {
        try {
          // Get the workbook
          const workbook = viz.getWorkbook();
          const activeSheet = workbook.getActiveSheet();

          // Get the data from the sheet
          activeSheet
            .getUnderlyingDataAsync()
            .then((table) => {
              const data = table.getData();

              // Process the data to extract casualty information
              // This will depend on the structure of your Tableau dashboard
              const casualtyData = {
                deaths: extractValue(data, "Deaths"),
                injured: extractValue(data, "Injured"),
                missing: extractValue(data, "Missing"),
                lastUpdated: new Date().toISOString(),
              };

              // Clean up
              viz.dispose();
              document.body.removeChild(placeholderDiv);

              resolve(casualtyData);
            })
            .catch((error) => {
              viz.dispose();
              document.body.removeChild(placeholderDiv);
              reject(error);
            });
        } catch (error) {
          viz.dispose();
          document.body.removeChild(placeholderDiv);
          reject(error);
        }
      },
    });
  } catch (error) {
    reject(error);
  }
}

function extractValue(data, columnName) {
  // This function would need to be adapted to your specific Tableau data structure
  // It should find the row with the given column name and extract the value
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (row[0].value === columnName) {
      return Number.parseInt(row[1].value, 10);
    }
  }
  return 0;
}
