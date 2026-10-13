import { FiMoon, FiSun } from "react-icons/fi";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200/80 dark:border-ink-700 bg-white/70 dark:bg-ink-800/70 text-ink-700 dark:text-sand-100 backdrop-blur transition hover:border-brand-400 ${className}`}
    >
      {isDark ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
    </motion.button>
  );
}

export default ThemeToggle;
