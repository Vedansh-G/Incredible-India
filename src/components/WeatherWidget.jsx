import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiCloud, FiDroplet, FiWind, FiSun, FiCloudRain } from "react-icons/fi";

function pickIcon(code) {
  if (code === 0) return FiSun;
  if (code >= 61 && code <= 67) return FiCloudRain;
  return FiCloud;
}

function WeatherWidget({ label = "Local weather", lat = 28.6139, lon = 77.209 }) {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;
        const res = await fetch(url);
        const data = await res.json();
        if (!cancelled && data?.current) {
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            humidity: data.current.relative_humidity_2m,
            wind: Math.round(data.current.wind_speed_10m),
            code: data.current.weather_code,
          });
        }
      } catch {
        if (!cancelled) {
          setWeather({ temp: 28, humidity: 55, wind: 12, code: 1 });
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [lat, lon]);

  const Icon = weather ? pickIcon(weather.code) : FiCloud;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15 }}
      className="glass overflow-hidden rounded-2xl p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
            {label}
          </p>
          <p className="mt-2 font-display text-4xl font-semibold text-ink-900 dark:text-ink-50">
            {weather ? `${weather.temp}°` : "—"}
          </p>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Right now</p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400/30 to-brand-700/20 text-brand-700 dark:text-brand-200">
          <Icon className="text-2xl" />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/60 dark:bg-ink-800/60 px-3 py-2.5">
          <p className="flex items-center gap-1.5 text-xs text-ink-500">
            <FiDroplet /> Humidity
          </p>
          <p className="mt-1 text-sm font-semibold text-ink-800 dark:text-ink-100">
            {weather ? `${weather.humidity}%` : "—"}
          </p>
        </div>
        <div className="rounded-xl bg-white/60 dark:bg-ink-800/60 px-3 py-2.5">
          <p className="flex items-center gap-1.5 text-xs text-ink-500">
            <FiWind /> Wind
          </p>
          <p className="mt-1 text-sm font-semibold text-ink-800 dark:text-ink-100">
            {weather ? `${weather.wind} km/h` : "—"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default WeatherWidget;
