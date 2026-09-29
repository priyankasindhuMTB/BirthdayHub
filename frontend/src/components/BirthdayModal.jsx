"use client";

import { useEffect, useState } from "react";
import {
  FaBirthdayCake,
  FaTimes,
  FaUser,
  FaHeart,
  FaCalendarAlt,
  FaPhone,
  FaEnvelope,
  FaStickyNote,
  FaBell,
  FaSave,
  FaPlus,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

export default function BirthdayModal({
  isOpen,
  onClose,
  onSubmit,
  birthday,
}) {
  const [person_name, setPersonName] = useState("");
  const [relation, setRelation] = useState("");
  const [date_of_birth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [reminder_enabled, setReminderEnabled] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (birthday) {
      setPersonName(birthday.person_name || "");
      setRelation(birthday.relation || "");

      setDateOfBirth(
        birthday.date_of_birth
          ? birthday.date_of_birth.split("T")[0]
          : ""
      );

      setPhone(birthday.phone || "");
      setEmail(birthday.email || "");
      setNotes(birthday.notes || "");
      setReminderEnabled(birthday.reminder_enabled === 1);
    } else {
      setPersonName("");
      setRelation("");
      setDateOfBirth("");
      setPhone("");
      setEmail("");
      setNotes("");
      setReminderEnabled(false);
    }

    setErrors({});
  }, [birthday, isOpen]);

  if (!isOpen) return null;

  // =========================
  // FRONTEND VALIDATION
  // =========================
  const validateForm = () => {
    const newErrors = {};

    // Person Name
    if (!person_name.trim()) {
      newErrors.person_name = "Person name is required";
    } else if (person_name.trim().length < 2) {
      newErrors.person_name =
        "Person name must be at least 2 characters";
    }

    // Relation
    if (!relation.trim()) {
      newErrors.relation = "Relation is required";
    }

    // Date of Birth
    if (!date_of_birth) {
      newErrors.date_of_birth = "Date of birth is required";
    } else {
      const date = new Date(date_of_birth);

      if (Number.isNaN(date.getTime())) {
        newErrors.date_of_birth = "Please enter a valid date";
      }
    }

    // Phone
    if (phone.trim()) {
      if (!/^[0-9]{10}$/.test(phone.trim())) {
        newErrors.phone =
          "Phone number must be exactly 10 digits";
      }
    }

    // Email
    if (email.trim()) {
      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Reminder
    if (
      reminder_enabled !== true &&
      reminder_enabled !== false
    ) {
      newErrors.reminder_enabled =
        "Invalid reminder value";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    const formData = {
      person_name: person_name.trim(),
      relation: relation.trim(),
      date_of_birth,
      phone: phone.trim(),
      email: email.trim(),
      notes: notes.trim(),
      reminder_enabled: reminder_enabled ? 1 : 0,
    };

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" style={{ background: "rgba(18,21,28,0.5)" }}>
      <div className="bh-card w-full max-w-lg max-h-[95vh] overflow-hidden relative flex flex-col">

        <div className="h-1 w-full flex-shrink-0" style={{ background: "linear-gradient(90deg, var(--bh-accent), var(--bh-gold))" }} />

        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">

            <div className="relative">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white" style={{ background: "var(--bh-ink)" }}>
                <FaBirthdayCake className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>

              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                <HiSparkles className="w-2.5 h-2.5 text-white" />
              </div>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-bold">
                {birthday ? "Edit Birthday" : "Add Birthday"}
              </h2>

              <p className="text-xs text-gray-500 mt-0.5">
                {birthday
                  ? "Update the details below"
                  : "Fill in the details to add"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto p-5 sm:p-6 space-y-4 flex-1"
        >

          {/* Person Name */}
          <FormField
            icon={<FaUser className="w-3 h-3" />}
            label="Person Name"
            required
            error={errors.person_name}
          >
            <input
              type="text"
              placeholder="Enter person name"
              value={person_name}
              onChange={(e) => {
                setPersonName(e.target.value);

                if (errors.person_name) {
                  setErrors((prev) => ({
                    ...prev,
                    person_name: "",
                  }));
                }
              }}
              className={`bh-input ${errors.person_name ? "err" : ""}`}
            />
          </FormField>

          {/* Relation */}
          <FormField
            icon={<FaHeart className="w-3 h-3" />}
            label="Relation"
            required
            error={errors.relation}
          >
            <input
              type="text"
              placeholder="Friend, Brother, Sister..."
              value={relation}
              onChange={(e) => {
                setRelation(e.target.value);

                if (errors.relation) {
                  setErrors((prev) => ({
                    ...prev,
                    relation: "",
                  }));
                }
              }}
              className={`bh-input ${errors.relation ? "err" : ""}`}
            />
          </FormField>

          {/* Date */}
          <FormField
            icon={<FaCalendarAlt className="w-3 h-3" />}
            label="Date of Birth"
            required
            error={errors.date_of_birth}
          >
            <input
              type="date"
              value={date_of_birth}
              onChange={(e) => {
                setDateOfBirth(e.target.value);

                if (errors.date_of_birth) {
                  setErrors((prev) => ({
                    ...prev,
                    date_of_birth: "",
                  }));
                }
              }}
              className={`bh-input ${errors.date_of_birth ? "err" : ""}`}
            />
          </FormField>

          {/* Phone + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Phone */}
            <FormField
              icon={<FaPhone className="w-3 h-3" />}
              label="Phone"
              error={errors.phone}
            >
              <input
                type="text"
                inputMode="numeric"
                maxLength={10}
                placeholder="Phone number"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value.replace(
                    /\D/g,
                    ""
                  );

                  setPhone(value);

                  if (errors.phone) {
                    setErrors((prev) => ({
                      ...prev,
                      phone: "",
                    }));
                  }
                }}
                className={`bh-input ${errors.phone ? "err" : ""}`}
              />
            </FormField>

            {/* Email */}
            <FormField
              icon={<FaEnvelope className="w-3 h-3" />}
              label="Email"
              error={errors.email}
            >
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);

                  if (errors.email) {
                    setErrors((prev) => ({
                      ...prev,
                      email: "",
                    }));
                  }
                }}
                className={`bh-input ${errors.email ? "err" : ""}`}
              />
            </FormField>

          </div>

          {/* Notes */}
          <FormField
            icon={<FaStickyNote className="w-3 h-3" />}
            label="Notes"
          >
            <textarea
              placeholder="Add any special notes..."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bh-input h-auto py-2.5 resize-none"
            />
          </FormField>

          {/* Reminder */}
          <label className="flex items-center justify-between p-3.5 rounded-xl cursor-pointer border" style={{ borderColor: "var(--bh-line)", background: "var(--bh-bg)" }}>

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--bh-accent)" }}>
                <FaBell className="w-4 h-4 text-white" />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Birthday Reminder
                </p>

                <p className="text-xs text-gray-500">
                  Get notified before the day
                </p>
              </div>

            </div>

            {/* Toggle */}
            <div className="relative flex-shrink-0">

              <input
                type="checkbox"
                checked={reminder_enabled}
                onChange={(e) =>
                  setReminderEnabled(e.target.checked)
                }
                className="sr-only peer"
              />

              <div className="w-11 h-6 bg-[var(--bh-line)] peer-focus:ring-4 peer-focus:ring-[color-mix(in_srgb,var(--bh-accent)_20%,transparent)] rounded-full peer peer-checked:bg-[var(--bh-accent)] transition-all" />

              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all peer-checked:translate-x-5" />

            </div>

          </label>

          {/* Footer */}
          <div className="flex gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 bh-btn-ghost"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 bh-btn"
            >
              {birthday ? (
                <>
                  <FaSave className="w-3.5 h-3.5" />
                  Update
                </>
              ) : (
                <>
                  <FaPlus className="w-3.5 h-3.5" />
                  Add Birthday
                </>
              )}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}


// =========================
// REUSABLE FORM FIELD
// =========================

function FormField({
  icon,
  label,
  required,
  error,
  children,
}) {
  return (
    <div className="space-y-1.5">

      <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-1.5">
        <span style={{ color: "var(--bh-accent)" }}>{icon}</span>

        {label}

        {required && (
          <span className="text-pink-500">*</span>
        )}
      </label>

      {children}

      {error && (
        <p className="text-xs text-red-500">
          {error}
        </p>
      )}

    </div>
  );
}