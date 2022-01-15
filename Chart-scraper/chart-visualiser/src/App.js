import "./App.css";
import React, { useEffect, useState } from "react";

function App() {
  // Request harvestTime data from the server port 8000
  const [chart, setChart] = useState([]);

  const [locationToSearch, setLocationToSearch] = useState("");
  const [ICAOToSearch, setICAOToSearch] = useState("");

  const [isMount, setIsMount] = useState(true);

  const [createPng, setCreatePng] = useState(false);
  const [createPdf, setCreatePdf] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("Loading chart data...");

    if (isMount) {
      setIsMount(false);
      return;
    }

    async function fetchData() {
      // Set loading state to true
      setIsLoading(true);
      setChart([]);

      const response = await fetch(
        `http://localhost:8001/api?createPng=${createPng}&createPdf=${createPdf}&locationToSearch=${locationToSearch}&ICAOToSearch=${ICAOToSearch}`
      );
      const data = await response.json();
      console.log(data);
      setChart(data);

      // Set loading state to false
      setIsLoading(false);
    }
    fetchData();
  }, [createPng, createPdf, locationToSearch, ICAOToSearch]);

  return (
    <div className="App">
      <form
        className="form-container"
        onSubmit={e => {
          e.preventDefault();
          setCreatePng(false);
          setCreatePdf(false);
          setLocationToSearch(e.target.locationToSearch.value);
          setICAOToSearch(e.target.ICAOToSearch.value);
        }}
      >
        <label>Location:</label>
        <input type="text" name="locationToSearch" />
        <label>ICAO:</label>
        <input type="text" name="ICAOToSearch" />

        <button type="submit">Get Chart</button>
      </form>
      <main className="card-wrapper">
        {isLoading && <p className="fetching-chart">Fetching chart...</p>}
        {chart.map(item => (
          <a
            key={item.ICAO + item.rwy}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="card"
          >
            <h2 style={{ marginBottom: "8px", fontWeight: "500" }}>
              {item.location}
            </h2>
            <p>
              ICAO: <b>{item.ICAO}</b>
            </p>
            <p>
              Rwy: <b>{item.rwy}</b>
            </p>
            <p>
              Updated: <b>{item.date}</b>
            </p>
          </a>
        ))}
      </main>
    </div>
  );
}

export default App;
