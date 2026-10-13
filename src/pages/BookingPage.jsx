import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiArrowLeft, FiCreditCard, FiUsers, FiCalendar, FiClock } from "react-icons/fi";
import Layout from "../components/Layout";

function BookingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
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

  const [bookingData, setBookingData] = useState({
    visitDate: "",
    timeSlot: "",
    numberOfPeople: 1,
    paymentMethod: "UPI",
  });

  const [members, setMembers] = useState([{ name: "" }]);

  const [capacityError, setCapacityError] = useState("");

  const [isChecked, setIsChecked] = useState(false);

  function handleChange(e) {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  }

  function handlePeopleChange(e) {
    const count = Number(e.target.value);
    if (count > 5) {
      setCapacityError("Only 5 slots remaining.");
      return;
    }

    setCapacityError("");
    setBookingData({
      ...bookingData,
      numberOfPeople: count,
    });

    setMembers(Array.from({ length: count }, () => ({ name: "" })));
  }

  function handleMemberChange(index, e) {
    const updated = [...members];
    updated[index].name = e.target.value;
    setMembers(updated);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!isChecked) {
      alert("Please accept terms.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const amount = bookingData.numberOfPeople * 500;

      const orderRes = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        {
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        order_id: orderRes.data.id,
        name: "Tourism Portal",
        description: `Booking for ${site.name}`,
        handler: async function (response) {
          const verifyRes = await axios.post(
            "http://localhost:5000/api/payment/verify",
            response
          );

          if (!verifyRes.data.success) {
            alert("Payment Verification Failed");
            return;
          }

          await axios.post(
            "http://localhost:5000/api/bookings",
            {
              touristId: id,
              visitDate: bookingData.visitDate,
              timeSlot: bookingData.timeSlot,
              numberOfPeople: bookingData.numberOfPeople,
              paymentMethod: bookingData.paymentMethod,
              paymentAmount: amount,
              paymentStatus: "Paid",
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          alert("Booking Successful");

          navigate("/mybookings");
        },
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.open();
    } catch (err) {
      console.log(err);

      alert("Payment Failed");
    }
  }

  const amount = bookingData.numberOfPeople * 500;

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
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
          className="mb-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
            Secure booking
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900 dark:text-ink-50 sm:text-4xl">
            Booking for {site?.name || "your destination"}
          </h1>
          <p className="mt-2 text-ink-500 dark:text-ink-400">
            Choose your date, slot, and travelers — then pay securely.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            onSubmit={handleSubmit}
            className="card-surface space-y-6 p-6 sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="label-field">
                  <span className="inline-flex items-center gap-2">
                    <FiCalendar /> Visit Date
                  </span>
                </label>
                <input
                  required
                  min={new Date().toISOString().split("T")[0]}
                  type="date"
                  name="visitDate"
                  value={bookingData.visitDate}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-field">
                  <span className="inline-flex items-center gap-2">
                    <FiClock /> Time Slot
                  </span>
                </label>
                <select
                  required
                  name="timeSlot"
                  value={bookingData.timeSlot}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select Slot</option>
                  <option value="09-10">9 AM - 10 AM</option>
                  <option value="10-11">10 AM - 11 AM</option>
                  <option value="11-12">11 AM - 12 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label-field">
                <span className="inline-flex items-center gap-2">
                  <FiUsers /> Number of People
                </span>
              </label>
              <input
                required
                type="number"
                min="1"
                name="numberOfPeople"
                value={bookingData.numberOfPeople}
                onChange={handlePeopleChange}
                className="input-field max-w-[200px]"
              />
              {capacityError && (
                <p className="mt-2 text-sm text-accent">{capacityError}</p>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-ink-700 dark:text-ink-200">
                Traveler names
              </p>
              {members.map((member, index) => (
                <input
                  required
                  key={index}
                  type="text"
                  placeholder={`Person ${index + 1} Name`}
                  value={member.name}
                  onChange={(e) => handleMemberChange(index, e)}
                  className="input-field"
                />
              ))}
            </div>

            <div>
              <label className="label-field">
                <span className="inline-flex items-center gap-2">
                  <FiCreditCard /> Payment Method
                </span>
              </label>
              <select
                required
                name="paymentMethod"
                value={bookingData.paymentMethod}
                onChange={handleChange}
                className="input-field"
              >
                <option>UPI</option>
                <option>Credit Card</option>
                <option>Debit Card</option>
                <option>Net Banking</option>
              </select>
            </div>

            <label className="flex items-start gap-3 rounded-xl border border-ink-100 dark:border-ink-800 bg-sand-50/80 dark:bg-ink-800/40 p-4 text-sm text-ink-600 dark:text-ink-300">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
              />
              I agree that all information provided is correct.
            </label>

            <button type="submit" className="btn-primary w-full sm:w-auto">
              Proceed To Payment
            </button>
          </motion.form>

          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="h-fit glass-strong sticky top-24 rounded-2xl p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
              Price summary
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">
              {site?.name || "Destination"}
            </h2>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between text-ink-500">
                <span>Per person</span>
                <span className="font-medium text-ink-800 dark:text-ink-100">₹500</span>
              </div>
              <div className="flex justify-between text-ink-500">
                <span>Travelers</span>
                <span className="font-medium text-ink-800 dark:text-ink-100">
                  {bookingData.numberOfPeople}
                </span>
              </div>
              <div className="h-px bg-ink-100 dark:bg-ink-700" />
              <div className="flex justify-between">
                <span className="font-semibold text-ink-800 dark:text-ink-100">Total</span>
                <span className="font-display text-3xl font-semibold text-brand-700 dark:text-brand-300">
                  ₹{amount}
                </span>
              </div>
            </div>

            <p className="mt-6 text-xs leading-relaxed text-ink-400">
              You will be redirected to Razorpay to complete a secure payment.
            </p>
          </motion.aside>
        </div>
      </div>
    </Layout>
  );
}

export default BookingPage;
