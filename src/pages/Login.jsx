import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { FiCompass } from "react-icons/fi";
import { motion } from "framer-motion";
import axios from "axios";
import ThemeToggle from "../components/ThemeToggle";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      console.log(res.data);

      localStorage.setItem("token", res.data.token);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login Successful");

      navigate("/dashboard");
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Login Failed");
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=80)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-ink-950/85 via-brand-900/70 to-ink-900/80" />

      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center gap-10 px-4 py-12 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl text-white"
        >
          <div className="mb-6 inline-flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <FiCompass className="text-2xl" />
            </span>
            <span className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Incredible India
            </span>
          </div>
          <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
            Your next escape starts here
          </h1>
          <p className="mt-4 max-w-md text-base text-white/75 sm:text-lg">
            Book curated destinations, manage trips, and plan smarter with an AI travel companion.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="w-full max-w-md"
        >
          <div className="glass-strong rounded-3xl p-7 sm:p-8">
            <h2 className="font-display text-3xl font-semibold text-ink-900 dark:text-ink-50">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
              Sign in to continue your journey
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label className="label-field">User Name</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter User ID"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-field">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="input-field pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 dark:hover:text-ink-200"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full">
                Login
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-ink-200 dark:bg-ink-700" />
              <span className="text-xs font-medium uppercase tracking-wider text-ink-400">
                OR
              </span>
              <div className="h-px flex-1 bg-ink-200 dark:bg-ink-700" />
            </div>

            <button
              type="button"
              className="btn-ghost w-full"
            >
              <FaGoogle className="text-accent" />
              Continue with Google
            </button>

            <p className="mt-6 text-center text-sm text-ink-600 dark:text-ink-300">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="font-semibold text-brand-600 dark:text-brand-300">
                Signup
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
