
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);
  const [activeInput, setActiveInput] = useState(null);

  const searchBus = async () => {
    try {
      const response = await axios.post(
        "https://bus-beee.onrender.com/routes/search",
        {
          source: source,
          destination: destination,
        }
      );

      console.log(response.data);
      setRoutes(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch all bus stops when the app loads
  useEffect(() => {
    const fetchStops = async () => {
      try {
        const response = await axios.get(
          "https://bus-beee.onrender.com/routes/stops/all"
        );

        console.log(response.data);
        setStops(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStops();
  }, []);

  // Close suggestions when clicking outside the search box
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveInput(null);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Filter stops for FROM
  const filteredStops = stops.filter(
    (stop) =>
      stop.toLowerCase().includes(source.toLowerCase()) &&
      stop.toLowerCase() !== source.toLowerCase()
  );

  // Filter stops for TO
  const filteredDestinationStops = stops.filter(
    (stop) =>
      stop.toLowerCase().includes(destination.toLowerCase()) &&
      stop.toLowerCase() !== destination.toLowerCase()
  );

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          🚌 <span>Where's My Bus</span>
        </div>

        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">Routes</a>
          <a href="#">About</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">

        <div className="hero-content">
          <h1>
            Find your bus.
            <br />
            Find your way.
          </h1>

          <p>
            Search Kolkata bus routes quickly and easily.
          </p>
        </div>

        {/* Search Box */}
        <div
          className="search-container"
          onClick={(e) => e.stopPropagation()}
        >

          {/* FROM */}
          <div className="location-input">
            <span className="input-icon">🚌</span>

            <div className="input-content">
              <label>FROM</label>

              <input
                type="text"
                placeholder="Enter source"
                value={source}
                onFocus={() => setActiveInput("source")}
                onChange={(e) => {
                  setSource(e.target.value);
                  setRoutes([]);
                }}
              />

              {activeInput === "source" &&
                source &&
                filteredStops.length > 0 && (
                  <div className="suggestions-dropdown">
                    {filteredStops.map((stop) => (
                      <div
                        className="suggestion"
                        key={stop}
                        onClick={() => {
                          setSource(stop);
                          setActiveInput(null);
                        }}
                      >
                        {stop}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>

          <div className="divider"></div>

          {/* TO */}
          <div className="location-input">
            <span className="input-icon">🚌</span>

            <div className="input-content">
              <label>TO</label>

              <input
                type="text"
                placeholder="Enter destination"
                value={destination}
                onFocus={() => setActiveInput("destination")}
                onChange={(e) => {
                  setDestination(e.target.value);
                  setRoutes([]);
                }}
              />

              {activeInput === "destination" &&
                destination &&
                filteredDestinationStops.length > 0 && (
                  <div className="suggestions-dropdown">
                    {filteredDestinationStops.map((stop) => (
                      <div
                        className="suggestion"
                        key={stop}
                        onClick={() => {
                          setDestination(stop);
                          setActiveInput(null);
                        }}
                      >
                        {stop}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>

          <button
            className="search-button"
            onClick={searchBus}
          >
            🔍 Search buses
          </button>

        </div>

      </section>

      {/* Results */}
      <section className="results-section">

        {routes.length > 0 && (
          <h2>Available buses</h2>
        )}

        {routes.map((bus, index) => (

          /* =====================================================
             TRANSFER ROUTE
             ===================================================== */

          bus.type === "transfer" ? (

            <div
              className="route-card"
              key={index}
            >

              {/* FIRST BUS */}
              <div className="route-header">
                <div>
                  <span className="route-label">
                    FIRST BUS
                  </span>

                  <h3>{bus.firstBus.routeNo}</h3>
                </div>

                <span className="bus-icon">
                  🚌
                </span>
              </div>

              {/* FIRST BUS ROUTE */}
              <div className="route-line">

                {/* SOURCE */}
                <div className="stop">
                  <span className="dot start-dot"></span>
                  <span>{source}</span>
                </div>

                {/* FIRST BUS STOPS */}
                {bus.firstBus.stopsBetween.map((stop, stopIndex) => (
                  <div
                    className="stop"
                    key={stopIndex}
                  >
                    <span className="dot small"></span>
                    <span>{stop}</span>
                  </div>
                ))}

                {/* TRANSFER STOP */}
                <div className="stop">
                  <span className="dot destination-dot"></span>
                  <span>{bus.transferAt}</span>
                </div>

              </div>

              {/* TRANSFER MESSAGE */}
              <div className="transfer-message">
                🔄 Change bus at{" "}
                <strong>{bus.transferAt}</strong>
              </div>

              {/* SECOND BUS */}
              <div className="route-header">
                <div>
                  <span className="route-label">
                    SECOND BUS
                  </span>

                  <h3>{bus.secondBus.routeNo}</h3>
                </div>

                <span className="bus-icon">
                  🚌
                </span>
              </div>

              {/* SECOND BUS ROUTE */}
              <div className="route-line">

                {/* TRANSFER STOP */}
                <div className="stop">
                  <span className="dot start-dot"></span>
                  <span>{bus.transferAt}</span>
                </div>

                {/* SECOND BUS STOPS */}
                {bus.secondBus.stopsBetween.map((stop, stopIndex) => (
                  <div
                    className="stop"
                    key={stopIndex}
                  >
                    <span className="dot small"></span>
                    <span>{stop}</span>
                  </div>
                ))}

                {/* DESTINATION */}
                <div className="stop">
                  <span className="dot destination-dot"></span>
                  <span>{destination}</span>
                </div>

              </div>

            </div>

          ) : (

            /* =====================================================
               DIRECT ROUTE
               ===================================================== */

            <div
              className="route-card"
              key={index}
            >

              {/* Route Header */}
              <div className="route-header">
                <div>
                  <span className="route-label">
                    BUS ROUTE
                  </span>

                  <h3>{bus.routeNo}</h3>
                </div>

                <span className="bus-icon">
                  🚌
                </span>
              </div>

              {/* Route Line */}
              <div className="route-line">

                {/* Starting Point */}
                <div className="stop">
                  <span className="dot start-dot"></span>
                  <span>{source}</span>
                </div>

                {/* Intermediate Stops */}
                {bus.stopsBetween.map((stop, stopIndex) => (
                  <div
                    className="stop"
                    key={stopIndex}
                  >
                    <span className="dot small"></span>
                    <span>{stop}</span>
                  </div>
                ))}

                {/* Destination */}
                <div className="stop">
                  <span className="dot destination-dot"></span>
                  <span>{destination}</span>
                </div>

              </div>

            </div>

          )

        ))}

      </section>

    </div>
  );
}

export default App;

