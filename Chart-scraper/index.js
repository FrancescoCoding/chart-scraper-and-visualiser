require("dotenv").config();

const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

const harvestTime = async (
  createPng = false,
  createPdf = false,
  locationToSearch = "",
  ICAOToSearch = ""
) => {
  console.log("Launching function...");

  try {
    locationToSearch = locationToSearch.trim().toLowerCase();
    ICAOToSearch = ICAOToSearch.trim().toLowerCase();

    const targetUrl =
      "https://nats-uk.ead-it.com/cms-nats/opencms/en/Charts/type-a-charts/";

    const browser = await puppeteer.launch({
      headless: true,
      timeout: 0,
      slowMo: 30,
    });

    // Open browser window
    const page = await browser.newPage();

    // Navigate to the target URL and wait for the page to load
    await page.goto(targetUrl, { waitUntil: "networkidle2" });
    // Make the page fullscreen
    await page.setViewport({ width: 1920, height: 1080 });

    // EVALUATE PAGE DOM
    const evaluatedPage = await page.evaluate(
      (locationToSearch, ICAOToSearch) => {
        // For each child of #page-complete > div.container_grey > table > tbody starting from the second child, get each child's text
        const children = document.querySelector(
          "#page-complete > div.container_grey > table > tbody"
        ).children;

        // Chart array to store each chart's information
        const chart = [];

        for (let i = 1; i < children.length; i++) {
          const child = children[i];
          const text = child.textContent;
          // console.log(text);
          
          // Separate the first text until the first - and put it in a variable called location and remove whitespaces
          const location = text.split("-")[0].trim();
          // Separate the second text until the second - and put it in a variable called ICAO
          const ICAO = text.split("-")[1].trim();
          // Get the first 10 characters after the second - of the text and put it in a variable called time
          const rwy = text.split("-")[2].substring(1, 10);
          // Get the text after the second \n and before the third \n and put it in a variable called chart
          const date = text.split("\n")[2].trim();
          // Get the corresponding download link and put it in a variable called link
          const link = child.querySelector("a").href;

          // If the location is the same as the searched location, push the data to the chart array
          if (
            (location.toLowerCase().includes(locationToSearch) &&
              locationToSearch !== "") ||
            (ICAO.toLowerCase() === ICAOToSearch && ICAOToSearch !== "")
          ) {
            chart.push({
              location,
              ICAO,
              rwy,
              date,
              link,
            });
            // child.querySelector("a").click();
            continue;
          }
        }

        // Print the chart array to the console
        console.log("Chart info: ", chart);
        return chart;
      },
      locationToSearch,
      ICAOToSearch
    );

    if (createPng) {
      // Save page screenshot to .png
      await page.screenshot({ path: "page-png-printed.png" });
    }
    if (createPdf) {
      // Print page to pdf
      await page.pdf({ path: "page-pdf-printed.pdf", format: "a4" });
    }

    console.log(evaluatedPage);
    return evaluatedPage;
  } catch (error) {
    console.error(error);
  }
};

// Respond to GET requests for /api with the chart array
app.get("/api", async (req, res) => {
  // Get the query parameters
  const { createPng, createPdf, locationToSearch, ICAOToSearch } = req.query;

  // Call the harvestTime function if the query parameters are not empty
  if (locationToSearch || ICAOToSearch) {
    // Await the harvestTime function and store the chart array in a variable called chart
    const chart = await harvestTime(
      createPng,
      createPdf,
      locationToSearch,
      ICAOToSearch
    );

    // Send the chart array to the client
    res.send(chart);
  } else {
    console.log("No query parameters provided");
  }

  // Handle promise rejection
  res.on("error", err => console.error(err));
});

// Listen for requests
app.listen(8001, () => {
  console.log(`Listening on port 8001`);
});
