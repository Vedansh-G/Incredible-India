import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FiSearch, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import Layout from "../components/Layout";
import TouristCard from "../components/TouristCard";
import WeatherWidget from "../components/WeatherWidget";

function Dashboard() {
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/api/citizens/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setIsRegistered(res.data.registered);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [search, setSearch] = useState("");

  const [sites, setSites] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tourists")
      .then((res) => {
        setSites(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", { replace: true });
  }

  const filteredSites = sites.filter((site) =>
    site.name.toLowerCase().includes(search.toLowerCase())
  );

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Layout>
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=80)",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/75 via-ink-950/55 to-sand-50 dark:to-ink-950" />

        <div className="mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl text-white"
          >
            <p className="mb-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Incredible India
            </p>
            <h1 className="text-xl font-medium text-white/90 sm:text-2xl">
              Welcome back, {user?.username}
            </h1>
            <p className="mt-3 max-w-xl text-base text-white/70 sm:text-lg">
              Discover destinations worth the journey — search, explore, and book in minutes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 max-w-2xl"
          >
            <div className="flex items-center gap-3 rounded-2xl bg-white/95 dark:bg-ink-900/95 p-2 shadow-lift backdrop-blur">
              <div className="flex flex-1 items-center gap-3 px-3">
                <FiSearch className="text-xl text-brand-600" />
                <input
                  type="text"
                  placeholder="Search places, cities, experiences..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent py-3 text-ink-900 dark:text-ink-50 outline-none placeholder:text-ink-400"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-surface p-6 sm:p-7"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
                  Traveler profile
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">
                  {user?.username}
                </h2>
                <p className="mt-1 text-sm text-ink-500">Role · {user?.role}</p>
              </div>

              {!isRegistered ? (
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="btn-accent !py-2.5 !px-4 text-sm"
                >
                  <FiAlertCircle />
                  Complete Registration
                </button>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-xl bg-brand-50 dark:bg-brand-900/40 px-4 py-2 text-sm font-semibold text-brand-700 dark:text-brand-200">
                  <FiCheckCircle />
                  Registered
                </span>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/mybookings")}
                className="btn-ghost !py-2.5 !px-4 text-sm"
              >
                View bookings
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-2.5 text-sm font-semibold text-accent transition hover:bg-accent hover:text-white"
              >
                Logout
              </button>
            </div>
          </motion.div>

          <WeatherWidget label="Travel weather" />
        </div>

        <div className="mt-12 flex items-end justify-between gap-4">
          <div>
            <h2 className="section-title">Popular destinations</h2>
            <p className="mt-2 text-ink-500 dark:text-ink-400">
              {filteredSites.length} place{filteredSites.length === 1 ? "" : "s"} to explore
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredSites.map((site, index) => (
            <TouristCard
              key={site.tourist_id}
              site={site}
              index={index}
              isRegistered={isRegistered}
              onDetails={() => navigate(`/site/${site.tourist_id}`)}
              onBook={() => {
                if (!isRegistered) {
                  alert("Please complete registration first.");
                  return;
                }
                navigate(`/booking/${site.tourist_id}`);
              }}
            />
          ))}
        </div>

        {filteredSites.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-ink-200 dark:border-ink-700 p-12 text-center text-ink-500">
            No destinations match your search.
          </div>
        )}
      </section>
    </Layout>
  );
}

export default Dashboard;
