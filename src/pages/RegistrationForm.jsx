import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FiArrowLeft, FiShield } from "react-icons/fi";
import Layout from "../components/Layout";

function RegistrationForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dob: "",
    nationality: "Indian",
    aadhaarNo: "",
    panNo: "",
    passportNo: "",
  });

  const [documents, setDocuments] = useState({
    aadhaarDoc: null,
    panDoc: null,
    passportDoc: null,
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleFileChange(e) {
    setDocuments({
      ...documents,
      [e.target.name]: e.target.files[0],
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...formData,
        aadhaarDoc: documents.aadhaarDoc?.name,
        panDoc: documents.panDoc?.name,
        passportDoc: documents.passportDoc?.name,
      };

      await axios.post(
        "http://localhost:5000/api/citizens/register",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Registration Successful");

      navigate("/dashboard");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-ink-500 transition hover:text-brand-600"
        >
          <FiArrowLeft /> Back to dashboard
        </button>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-surface overflow-hidden"
        >
          <div className="border-b border-ink-100 dark:border-ink-800 bg-gradient-to-r from-brand-600 to-brand-800 px-6 py-8 text-white sm:px-8">
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <FiShield className="text-xl" />
            </div>
            <h1 className="font-display text-3xl font-semibold">Complete registration</h1>
            <p className="mt-2 text-sm text-white/75">
              Verify your identity once to unlock bookings across Wanderly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">
            <div>
              <label className="label-field">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="input-field"
              />
            </div>

            <div>
              <label className="label-field">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="input-field"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="label-field">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-field">Nationality</label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="Indian">Indian</option>
                  <option value="Foreign">Foreign</option>
                </select>
              </div>
            </div>

            {formData.nationality === "Indian" && (
              <div className="space-y-4 rounded-2xl border border-ink-100 dark:border-ink-800 bg-sand-50/60 dark:bg-ink-800/30 p-4 sm:p-5">
                <p className="text-sm font-semibold text-ink-700 dark:text-ink-200">
                  Indian documents
                </p>

                <input
                  type="text"
                  name="aadhaarNo"
                  value={formData.aadhaar}
                  onChange={handleChange}
                  placeholder="Aadhaar Number"
                  className="input-field"
                />

                <input
                  type="text"
                  name="panNo"
                  value={formData.pan}
                  onChange={handleChange}
                  placeholder="PAN Number"
                  className="input-field"
                />

                <div>
                  <label className="label-field">Aadhaar Document</label>
                  <input
                    type="file"
                    name="aadhaarDoc"
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-ink-500 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-500"
                  />
                </div>

                <div>
                  <label className="label-field">PAN Document</label>
                  <input
                    type="file"
                    name="panDoc"
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-ink-500 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-500"
                  />
                </div>
              </div>
            )}

            {formData.nationality !== "Indian" && (
              <div className="space-y-4 rounded-2xl border border-ink-100 dark:border-ink-800 bg-sand-50/60 dark:bg-ink-800/30 p-4 sm:p-5">
                <p className="text-sm font-semibold text-ink-700 dark:text-ink-200">
                  Passport details
                </p>

                <input
                  type="text"
                  name="passportNo"
                  value={formData.passport}
                  onChange={handleChange}
                  placeholder="Passport Number"
                  className="input-field"
                />

                <div>
                  <label className="label-field">Passport Document</label>
                  <input
                    type="file"
                    name="passportDoc"
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-ink-500 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-500"
                  />
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary w-full">
              Submit
            </button>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
}

export default RegistrationForm;
