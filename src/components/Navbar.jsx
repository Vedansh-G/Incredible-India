import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCompass, FiMessageSquare, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import ProfileDropdown from "./ProfileDropdown";

function Navbar({ transparent = false }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const token = localStorage.getItem("token");
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive
        ? "text-brand-600 dark:text-brand-300"
        : "text-ink-600 dark:text-ink-300 hover:text-brand-600 dark:hover:text-brand-300"
    }`;

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-40 ${
        transparent
          ? "bg-transparent"
          : "glass border-b border-white/40 dark:border-white/5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to={token ? "/dashboard" : "/"} className="group flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
            <FiCompass className="text-lg" />
          </span>
          <span className="font-display text-2xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
            Incredible India
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {token && (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                Explore
              </NavLink>
              <NavLink to="/mybookings" className={linkClass}>
                My Bookings
              </NavLink>
            </>
          )}
          <NavLink to="/ai" className={linkClass}>
            AI Assistant
          </NavLink>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {token ? (
            <ProfileDropdown user={user} />
          ) : (
            <Link to="/" className="btn-primary !py-2 !px-4 text-sm">
              Sign in
            </Link>
          )}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200 dark:border-ink-700 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-ink-100 dark:border-ink-800 bg-white/95 dark:bg-ink-950/95 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {token && (
              <>
                <NavLink to="/dashboard" className={linkClass} onClick={() => setMobileOpen(false)}>
                  Explore
                </NavLink>
                <NavLink to="/mybookings" className={linkClass} onClick={() => setMobileOpen(false)}>
                  My Bookings
                </NavLink>
              </>
            )}
            <NavLink
              to="/ai"
              className={linkClass}
              onClick={() => setMobileOpen(false)}
            >
              <span className="inline-flex items-center gap-2">
                <FiMessageSquare /> AI Assistant
              </span>
            </NavLink>
          </div>
        </div>
      )}
    </motion.header>
  );
}

export default Navbar;
