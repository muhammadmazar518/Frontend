import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WEATHER_API_KEY = "066719477ade4350b7f100338261106";

const getColor = (condition) => {
  if (!condition) return "#38bdf8";
  const c = condition.toLowerCase();
  if (c.includes("sunny")) return "#fbbf24";
  if (c.includes("clear")) return "#38bdf8";
  if (c.includes("thunder")) return "#7c3aed";
  if (c.includes("snow")) return "#bae6fd";
  if (c.includes("rain") || c.includes("drizzle")) return "#3b82f6";
  if (c.includes("cloud") || c.includes("overcast")) return "#94a3b8";
  if (c.includes("mist") || c.includes("fog")) return "#9ca3af";
  return "#38bdf8";
};

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchCity, setSearchCity] = useState("");

  const fetchWeather = async (query) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${query}&days=5&aqi=no`
      );
      if (!res.ok) throw new Error("City not found. Please try another name.");
      const data = await res.json();
      setWeather(data.current);
      setForecast(data.forecast.forecastday);
      setLocation(`${data.location.name}, ${data.location.country}`);
    } catch (err) {
      setError(err.message || "Failed to fetch weather.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchWeather(`${latitude},${longitude}`);
        },
        () => {
          fetchWeather("Lahore");
        }
      );
    } else {
      fetchWeather("Lahore");
    }
  }, []);

  const handleSearch = () => {
    if (searchCity.trim()) fetchWeather(searchCity.trim());
  };

  const accentColor = weather ? getColor(weather.condition.text) : "#38bdf8";
  const navigate = useNavigate();
  return (
    <div>
      <h1 style={styles.heading}>Weather</h1>
      <p style={styles.sub}>Live weather for your current location
      </p>
      <div style={styles.searchRow}>
        <span style={styles.locationPin}>📍</span>
        <input
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search another city..."
          style={styles.input}
        />
        <button onClick={handleSearch} style={{ ...styles.btn, background: accentColor }}>
          Search
        </button>
        <button
          onClick={() => {
            setSearchCity("");
            navigator.geolocation?.getCurrentPosition(
              (pos) => fetchWeather(`${pos.coords.latitude},${pos.coords.longitude}`),
              () => fetchWeather("Lahore")
            );
          }}
          style={styles.locationBtn}
        >
          📡 My Location
        </button>
      </div>

      {loading && (
        <div style={styles.loadingWrap}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Detecting your location...</p>
        </div>
      )}

      {error && !loading && (
        <div style={styles.errorBox}>{error}</div>
      )}

      {weather && !loading && (
        <>
          <div style={{ ...styles.mainCard, borderTop: `4px solid ${accentColor}` }}>
            <div style={styles.mainLeft}>
              <div style={styles.locationRow}>
                <span>📍</span>
                <span style={styles.locationName}>{location}</span>
              </div>
              <div style={styles.tempRow}>
                <img src={`https:${weather.condition.icon}`} alt={weather.condition.text} style={styles.weatherIcon} />
                <span style={{ ...styles.temp, color: accentColor }}>{weather.temp_c}°C</span>
              </div>
              <p style={styles.conditionText}>{weather.condition.text}</p>
              <p style={styles.feelsLike}>Feels like {weather.feelslike_c}°C</p>
              <p style={styles.lastUpdated}>Last updated: {weather.last_updated}</p>
            </div>

            <div style={styles.mainRight}>
              {[
                { label: "Humidity", value: `${weather.humidity}%`, icon: "💧" },
                { label: "Wind Speed", value: `${weather.wind_kph} km/h`, icon: "💨" },
                { label: "Visibility", value: `${weather.vis_km} km`, icon: "👁" },
                { label: "UV Index", value: weather.uv, icon: "☀️" },
                { label: "Pressure", value: `${weather.pressure_mb} mb`, icon: "🌡" },
                { label: "Cloud Cover", value: `${weather.cloud}%`, icon: "☁️" },
              ].map((item) => (
                <div key={item.label} style={styles.statItem}>
                  <span style={styles.statIcon}>{item.icon}</span>
                  <div>
                    <p style={styles.statLabel}>{item.label}</p>
                    <p style={{ ...styles.statValue, color: accentColor }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {forecast.length > 0 && (
            <div>
              <h2 style={styles.forecastTitle}>5-Day Forecast</h2>
              <div style={styles.forecastGrid}>
                {forecast.map((day) => (
                  <div key={day.date} style={styles.forecastCard}>
                    <p style={styles.forecastDay}>
                      {new Date(day.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </p>
                    <img src={`https:${day.day.condition.icon}`} alt={day.day.condition.text} style={{ width: "48px" }} />
                    <p style={styles.forecastCondition}>{day.day.condition.text}</p>
                    <div style={styles.forecastTemps}>
                      <span style={{ ...styles.forecastHigh, color: accentColor }}>{day.day.maxtemp_c}°</span>
                      <span style={styles.forecastLow}>{day.day.mintemp_c}°</span>
                    </div>
                    <div style={styles.forecastExtra}>
                      <span>💧 {day.day.avghumidity}%</span>
                      <span>💨 {day.day.maxwind_kph} km/h</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

const styles = {
  page: { 
      fontFamily: "'Segoe UI', sans-serif", 
      background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)", 
      color: "#111827", 
      margin: 0, 
      padding: 0 
  },
  
  heading: { 
      color: "#fff", 
      fontSize: "30px", 
      fontWeight: "800", 
      margin: "0 0 30px", 
      letterSpacing: "-0.5px" 
  },
  
  sub: { 
      color: "#000", 
      fontSize: "14px", 
      marginBottom: "24px" 
  },
  
  searchRow: { 
      display: "flex", 
      alignItems: "center", 
      gap: "10px", 
      marginBottom: "24px", 
      flexWrap: "wrap" 
  },
  
  locationPin: { 
      fontSize: "18px" 
  },
  
  input: { 
      flex: 1, 
      minWidth: "200px", 
      padding: "11px 14px", 
      background: "#161824", 
      border: "1px solid #1e2130", 
      borderRadius: "10px", 
      color: "#fff", 
      fontSize: "14px", 
      outline: "none" 
  },
  
  btn: { 
      padding: "11px 22px", 
      border: "none", 
      borderRadius: "10px", 
      color: "#0d0f14", 
      fontWeight: "700", 
      fontSize: "14px", 
      cursor: "pointer", 
      flexShrink: 0 
  },
  
  locationBtn: { 
      padding: "11px 16px", 
      border: "1px solid #1e2130", 
      borderRadius: "10px", 
      background: "#161824", 
      color: "#9ca3af", 
      fontSize: "13px", 
      fontWeight: "600", 
      cursor: "pointer", 
      flexShrink: 0 
  },
  
  loadingWrap: { 
      textAlign: "center", 
      padding: "60px 20px" 
  },
  
  spinner: { 
      width: "40px", 
      height: "40px", 
      border: "3px solid #1e2130", 
      borderTop: "3px solid #38bdf8", 
      borderRadius: "50%", 
      margin: "0 auto 16px", 
      animation: "spin 0.8s linear infinite" 
  },
  
  loadingText: { 
      color: "#000", 
      fontSize: "14px" 
  },
  
  errorBox: { 
      background: "#1f0a0a", 
      border: "1px solid #7f1d1d", 
      color: "#fca5a5", 
      padding: "12px 16px", 
      borderRadius: "10px", 
      fontSize: "14px", 
      marginBottom: "20px" 
  },
  
  mainCard: { 
      background: "#161824", 
      border: "1px solid #1e2130", 
      borderRadius: "16px", 
      padding: "28px", 
      display: "flex", 
      gap: "32px", 
      marginBottom: "28px", 
      flexWrap: "wrap" 
  },
  
  mainLeft: { 
      flex: 1, 
      minWidth: "200px" 
  },
  
  locationRow: { 
      display: "flex", 
      alignItems: "center", 
      gap: "6px", 
      marginBottom: "12px" 
  },
  
  locationName: { 
      color: "#9ca3af", 
      fontSize: "13px", 
      fontWeight: "600" 
  },
  
  tempRow: { 
      display: "flex", 
      alignItems: "center", 
      gap: "8px", 
      marginBottom: "8px" 
  },
  
  weatherIcon: { 
      width: "64px", 
      height: "64px" 
  },
  
  temp: { 
      fontSize: "64px", 
      fontWeight: "800", 
      letterSpacing: "-2px" 
  },
  
  conditionText: { 
      color: "#fff", 
      fontSize: "18px", 
      fontWeight: "600", 
      margin: "0 0 4px" 
  },
  
  feelsLike: { 
      color: "#6b7280", 
      fontSize: "14px", 
      margin: "0 0 6px" 
  },
  
  lastUpdated: { 
      color: "#4b5563", 
      fontSize: "11px", 
      margin: 0 
  },
  
  mainRight: { 
      display: "grid", 
      gridTemplateColumns: "1fr 1fr", 
      gap: "12px", 
      alignContent: "start" 
  },
  
  statItem: { 
      display: "flex", 
      alignItems: "center", 
      gap: "10px", 
      background: "#0d0f14", 
      padding: "12px", 
      borderRadius: "10px" 
  },
  
  statIcon: { 
      fontSize: "20px" 
  },
  
  statLabel: { 
      color: "#6b7280", 
      fontSize: "11px", 
      margin: "0 0 2px", 
      fontWeight: "600" 
  },
  
  statValue: { 
      fontSize: "15px", 
      fontWeight: "700", 
      margin: 0 
  },
  
  forecastTitle: { 
      color: "#fff", 
      fontSize: "16px", 
      fontWeight: "700", 
      marginBottom: "14px" 
  },
  
  forecastGrid: { 
      display: "grid", 
      gridTemplateColumns: "repeat(5, 1fr)", 
      gap: "12px" 
  },
  
  forecastCard: { 
      background: "#161824", 
      border: "1px solid #1e2130", 
      borderRadius: "12px", 
      padding: "16px", 
      textAlign: "center" 
  },
  
  forecastDay: { 
      color: "#9ca3af", 
      fontSize: "11px", 
      fontWeight: "600", 
      margin: "0 0 8px" 
  },
  
  forecastCondition: { 
      color: "#fff", 
      fontSize: "11px", 
      margin: "6px 0 10px", 
      lineHeight: "1.4" 
  },
  
  forecastTemps: { 
      display: "flex", 
      justifyContent: "center", 
      gap: "8px", 
      marginBottom: "8px" 
  },
  
  forecastHigh: { 
      fontSize: "16px", 
      fontWeight: "700" 
  },
  
  forecastLow: { 
      fontSize: "16px", 
      fontWeight: "700", 
      color: "#6b7280" 
  },
  
  forecastExtra: { 
      display: "flex", 
      justifyContent: "space-between", 
      fontSize: "10px", 
      color: "#6b7280" 
  },
  
  topRow: { 
      display: "flex", 
      justifyContent: "flex-start", 
      marginBottom: "5px", 
      marginTop: "-10px", 
      marginLeft: "900px" 
  },
  
  dashboardBtn: { 
      background: "#000", 
      color: "#fff", 
      border: "none", 
      padding: "10px 15px", 
      borderRadius: "8px", 
      cursor: "pointer" 
  }
};

export default Weather;
