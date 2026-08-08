import { useState, useEffect } from "react";
import { PageHeader, Card, Input, Button, Spinner, ErrorBox } from "../components/ui";

const WEATHER_API_KEY = "066719477ade4350b7f100338261106";

const getColor = (condition) => {
  if (!condition) return "#38bdf8";
  const c = condition.toLowerCase();
  if (c.includes("sunny")) return "#fbbf24";
  if (c.includes("clear")) return "#38bdf8";
  if (c.includes("thunder")) return "#0ea5e9";
  if (c.includes("snow")) return "#bae6fd";
  if (c.includes("rain") || c.includes("drizzle")) return "#60a5fa";
  if (c.includes("cloud") || c.includes("overcast")) return "#a1a1aa";
  if (c.includes("mist") || c.includes("fog")) return "#a1a1aa";
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
    let cancelled = false;

    const queryCity = () =>
      new Promise((resolve) => {
        if (!navigator.geolocation) return resolve("Lahore");
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(`${pos.coords.latitude},${pos.coords.longitude}`),
          () => resolve("Lahore")
        );
      });

    queryCity()
      .then((q) =>
        fetch(`https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${q}&days=5&aqi=no`)
      )
      .then((res) => {
        if (!res.ok) throw new Error("City not found. Please try another name.");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setWeather(data.current);
        setForecast(data.forecast.forecastday);
        setLocation(`${data.location.name}, ${data.location.country}`);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to fetch weather.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearch = () => {
    if (searchCity.trim()) fetchWeather(searchCity.trim());
  };

  const useLocation = () => {
    setSearchCity("");
    navigator.geolocation?.getCurrentPosition(
      (pos) => fetchWeather(`${pos.coords.latitude},${pos.coords.longitude}`),
      () => fetchWeather("Lahore")
    );
  };

  const accentColor = weather ? getColor(weather.condition.text) : "#38bdf8";

  return (
    <div>
      <PageHeader title="Weather" sub="Live conditions for your location" />

      <div className="mb-6 flex flex-wrap items-center gap-2.5">
        <span className="text-lg">📍</span>
        <Input
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search another city..."
          className="max-w-[360px]"
        />
        <Button onClick={handleSearch}>Search</Button>
        <Button variant="outline" onClick={useLocation}>📡 My Location</Button>
      </div>

      {loading && (
        <div className="flex flex-col items-center py-[60px] text-center">
          <Spinner />
          <p className="mt-4 text-sm text-text-2">Detecting your location...</p>
        </div>
      )}

      {error && !loading && <ErrorBox>{error}</ErrorBox>}

      {weather && !loading && (
        <>
          <Card className="mb-7 border-t-4 p-6 sm:p-8" style={{ borderTopColor: accentColor }}>
            <div className="flex flex-wrap gap-8">
              <div className="min-w-[240px] flex-1">
                <div className="mb-3 flex items-center gap-1.5">
                  <span className="text-base">📍</span>
                  <span className="text-sm font-semibold text-text-2">{location}</span>
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <img
                    src={`https:${weather.condition.icon}`}
                    alt={weather.condition.text}
                    className="h-16 w-16"
                  />
                  <span className="font-display text-6xl font-extrabold tracking-tight" style={{ color: accentColor }}>
                    {weather.temp_c}°C
                  </span>
                </div>
                <p className="m-0 mb-1 text-lg font-semibold text-text">{weather.condition.text}</p>
                <p className="m-0 text-sm text-text-2">Feels like {weather.feelslike_c}°C</p>
                <p className="m-0 mt-1.5 text-[11px] text-text-3">Last updated: {weather.last_updated}</p>
              </div>

              <div className="grid min-w-[280px] flex-1 grid-cols-2 content-start gap-3 sm:grid-cols-3">
                {[
                  { label: "Humidity", value: `${weather.humidity}%`, icon: "💧" },
                  { label: "Wind Speed", value: `${weather.wind_kph} km/h`, icon: "💨" },
                  { label: "Visibility", value: `${weather.vis_km} km`, icon: "👁" },
                  { label: "UV Index", value: weather.uv, icon: "☀️" },
                  { label: "Pressure", value: `${weather.pressure_mb} mb`, icon: "🌡" },
                  { label: "Cloud Cover", value: `${weather.cloud}%`, icon: "☁️" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5 rounded-md border border-line bg-surface-2/60 p-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="m-0 mb-0.5 text-[11px] font-semibold text-text-3">{item.label}</p>
                      <p className="m-0 text-[15px] font-bold" style={{ color: accentColor }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {forecast.length > 0 && (
            <div>
              <h2 className="mb-3.5 text-[17px] font-bold text-text">5-Day Forecast</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {forecast.map((day) => (
                  <div key={day.date} className="rounded-md border border-line bg-surface p-4 text-center transition-shadow duration-200 hover:shadow-sm">
                    <p className="m-0 mb-2 text-[11px] font-semibold text-text-2">
                      {new Date(day.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </p>
                    <img
                      src={`https:${day.day.condition.icon}`}
                      alt={day.day.condition.text}
                      className="mx-auto w-12"
                    />
                    <p className="m-0 mt-1.5 mb-2.5 text-[11px] leading-relaxed text-text">{day.day.condition.text}</p>
                    <div className="mb-2 flex justify-center gap-2">
                      <span className="text-base font-bold" style={{ color: accentColor }}>{day.day.maxtemp_c}°</span>
                      <span className="text-base font-bold text-text-3">{day.day.mintemp_c}°</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-text-3">
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
    </div>
  );
};

export default Weather;
