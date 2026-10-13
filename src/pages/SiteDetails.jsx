import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiTag,
  FiPhone,
  FiUsers,
  FiClock,
  FiSun,
  FiArrowLeft,
  FiMessageSquare,
  FiCalendar,
} from "react-icons/fi";
import Layout from "../components/Layout";
import WeatherWidget from "../components/WeatherWidget";

function SiteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [site, setSite] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/tourists/${id}`)
      .then((res) => {
        setSite(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  if (!site) {
    return (
      <Layout>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
            <p className="font-display text-2xl font-semibold text-ink-700 dark:text-ink-200">
              Loading...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const details = [
    { icon: FiMapPin, title: "Address", value: site.address },
    { icon: FiTag, title: "Category", value: site.category },
    { icon: FiPhone, title: "Contact", value: site.phone || "Not Available" },
    { icon: FiUsers, title: "Daily Capacity", value: site.max_daily_capacity },
    { icon: FiClock, title: "Timings", value: site.timings || "Not Available" },
    { icon: FiSun, title: "Best Season", value: site.best_season || "Not Available" },
  ];
  console.log(site);
  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-ink-500 transition hover:text-brand-600"
        >
          <FiArrowLeft /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl shadow-lift"
        >
          <div className="relative h-[42vh] min-h-[280px] max-h-[480px]">
            <img
              src={site.image_url || "https://picsum.photos/1200/500"}
              alt={site.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/25 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
              <span className="mb-3 inline-block rounded-lg bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
                {site.category}
              </span>
              <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl md:text-6xl">
                {site.name}
              </h1>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            <div className="card-surface p-6 sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">
                About this place
              </h2>
              <p className="mt-4 text-base leading-8 text-ink-600 dark:text-ink-300">
                {site.description || "No description available."}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {details.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + i * 0.04 }}
                    whileHover={{ y: -4 }}
                    className="card-surface card-hover p-5"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300">
                      <Icon />
                    </div>
                    <h3 className="font-semibold text-ink-900 dark:text-ink-50">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
                      {item.value}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <div className="space-y-5">
            <WeatherWidget label="On-site weather" />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-strong sticky top-24 rounded-2xl p-6"
            >
              <h3 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-50">
                Ready to visit?
              </h3>
              <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
                Secure your slot or ask our AI guide for local tips.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/booking/${site.tourist_id}`)}
                  className="btn-primary w-full"
                >
                  <FiCalendar />
                  Book Now
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/ai/${site.tourist_id}`)}
                  className="btn-ghost w-full"
                >
                  <FiMessageSquare />
                  Ask AI Assistant
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
    
  );
}

export default SiteDetails;
