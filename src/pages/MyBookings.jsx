import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiCalendar,
  FiClock,
  FiUsers,
  FiTag,
  FiArrowLeft,
} from "react-icons/fi";
import Layout from "../components/Layout";

function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/api/bookings/myBookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setBookings(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  async function cancelBooking(id) {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/bookings/cancel/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  async function rescheduleBooking(id) {
    const visitDate = prompt("Enter new date");

    const timeSlot = prompt("Enter slot");

    if (!visitDate || !timeSlot) return;

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/bookings/reschedule/${id}`,
        {
          visitDate,
          timeSlot,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  function statusStyles(status) {
    if (status === "Cancelled") {
      return "bg-red-50 text-accent dark:bg-red-950/40 dark:text-red-300";
    }
    if (status === "Confirmed" || status === "Booked") {
      return "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200";
    }
    return "bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-200";
  }

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-ink-500 transition hover:text-brand-600"
        >
          <FiArrowLeft /> Back to explore
        </button>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="section-title">My Bookings</h1>
          <p className="mt-2 text-ink-500 dark:text-ink-400">
            Manage upcoming trips, reschedule slots, or cancel when plans change.
          </p>
        </motion.div>

        <div className="space-y-5">
          {bookings.map((booking, index) => (
            <motion.article
              key={booking.booking_id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.05, 0.3) }}
              whileHover={{ y: -4 }}
              className="card-surface card-hover overflow-hidden"
            >
              <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">
                      {booking.name}
                    </h2>
                    <span
                      className={`rounded-lg px-3 py-1 text-xs font-semibold ${statusStyles(
                        booking.booking_status
                      )}`}
                    >
                      {booking.booking_status}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <p className="flex items-center gap-2 text-sm text-ink-500 dark:text-ink-400">
                      <FiMapPin className="text-brand-600" />
                      {booking.address}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-ink-500 dark:text-ink-400">
                      <FiTag className="text-brand-600" />
                      {booking.category}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-ink-500 dark:text-ink-400">
                      <FiCalendar className="text-brand-600" />
                      {booking.visit_date?.split("T")[0]}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-ink-500 dark:text-ink-400">
                      <FiClock className="text-brand-600" />
                      Slot {booking.time_slot}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-ink-500 dark:text-ink-400">
                      <FiUsers className="text-brand-600" />
                      {booking.number_of_people} people
                    </p>
                    <p className="text-sm font-semibold text-ink-800 dark:text-ink-100">
                      Amount · ₹{booking.payment_amount}
                    </p>
                  </div>
                </div>

                {booking.booking_status !== "Cancelled" && (
                  <div className="flex shrink-0 flex-wrap gap-3 sm:flex-col">
                    <button
                      type="button"
                      className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                      onClick={() => cancelBooking(booking.booking_id)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn-primary !py-2.5 !px-4 text-sm"
                      onClick={() => rescheduleBooking(booking.booking_id)}
                    >
                      Reschedule
                    </button>
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        {bookings.length === 0 && (
          <div className="rounded-2xl border border-dashed border-ink-200 dark:border-ink-700 p-14 text-center">
            <p className="font-display text-2xl font-semibold text-ink-700 dark:text-ink-200">
              No bookings yet
            </p>
            <p className="mt-2 text-ink-500">Explore destinations and book your first trip.</p>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="btn-primary mt-6"
            >
              Explore destinations
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default MyBookings;
