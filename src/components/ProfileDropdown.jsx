import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiLogOut, FiBookOpen, FiChevronDown } from "react-icons/fi";

function ProfileDropdown({ user }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-ink-200/80 dark:border-ink-700 bg-white/70 dark:bg-ink-800/70 px-3 py-2 backdrop-blur transition hover:border-brand-400"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-semibold text-white">
          {(user?.username || "U").charAt(0).toUpperCase()}
        </span>
        <span className="hidden sm:block max-w-[100px] truncate text-sm font-medium text-ink-800 dark:text-ink-100">
          {user?.username || "Traveler"}
        </span>
        <FiChevronDown className={`text-ink-500 transition ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl glass-strong shadow-lift"
          >
            <div className="border-b border-ink-100 dark:border-ink-800 px-4 py-3">
              <p className="text-sm font-semibold text-ink-900 dark:text-ink-50">
                {user?.username}
              </p>
              <p className="text-xs text-ink-500 dark:text-ink-400">{user?.role}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate("/dashboard");
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-ink-700 dark:text-ink-200 hover:bg-brand-50 dark:hover:bg-ink-800"
            >
              <FiUser /> Dashboard
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate("/mybookings");
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-ink-700 dark:text-ink-200 hover:bg-brand-50 dark:hover:bg-ink-800"
            >
              <FiBookOpen /> My Bookings
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 border-t border-ink-100 dark:border-ink-800 px-4 py-3 text-sm text-accent hover:bg-red-50 dark:hover:bg-ink-800"
            >
              <FiLogOut /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProfileDropdown;
