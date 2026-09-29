"use client";

import {
  FaBirthdayCake,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaStickyNote,
  FaBell,
  FaBellSlash,
  FaCheckCircle,
  FaTimes,
  FaEdit,
} from "react-icons/fa";

export default function BirthdayDetailsModal({
  isOpen,
  onClose,
  birthday,
  onEdit,
}) {
  if (!isOpen || !birthday) {
    return null;
  }

  const formattedDate = birthday.date_of_birth
    ? new Date(birthday.date_of_birth).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not provided";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="bh-card relative w-full max-w-lg max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="relative overflow-hidden">
          
          <div className="absolute inset-0" style={{ background: "var(--bh-ink)" }} />

          <div className="relative px-6 py-6">
            
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
            >
              <FaTimes className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4 pr-10">
              
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
                <FaBirthdayCake className="w-8 h-8 text-white" />
              </div>

              <div className="min-w-0">
                
                <h2 className="text-2xl font-extrabold text-white truncate">
                  {birthday.person_name}
                </h2>

                <p className="text-sm text-white/80 mt-1">
                  {birthday.relation || "Special Person"}
                </p>

              </div>

            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">

          {/* Status */}
          <div className="flex items-center justify-between mb-5 p-3 rounded-2xl bg-gray-50 border border-gray-100">
            
            <div className="flex items-center gap-2">
              
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  birthday.is_active === 1
                    ? "bg-green-500 animate-pulse"
                    : "bg-gray-400"
                }`}
              />

              <span className="text-sm font-semibold text-gray-700">
                {birthday.is_active === 1
                  ? "Active"
                  : "Inactive"}
              </span>

            </div>

            <div className="flex items-center gap-2 text-sm">
              
              {birthday.reminder_enabled === 1 ? (
                <>
                  <FaBell style={{ color: "var(--bh-accent)" }} />
                  <span className="font-semibold" style={{ color: "var(--bh-accent)" }}>
                    Reminder Enabled
                  </span>
                </>
              ) : (
                <>
                  <FaBellSlash className="text-gray-400" />
                  <span className="text-gray-500 font-semibold">
                    Reminder Disabled
                  </span>
                </>
              )}

            </div>

          </div>

          {/* Details */}
          <div className="space-y-3">

            <DetailRow
              icon={<FaCalendarAlt />}
              label="Birthday"
              value={formattedDate}
            />

            <DetailRow
              icon={<FaPhone />}
              label="Phone"
              value={birthday.phone || "Not provided"}
            />

            <DetailRow
              icon={<FaEnvelope />}
              label="Email"
              value={birthday.email || "Not provided"}
            />

            <DetailRow
              icon={<FaStickyNote />}
              label="Notes"
              value={birthday.notes || "No notes added"}
              multiline
            />

          </div>

          {/* Footer */}
          <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 bh-btn-ghost"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(birthday);
              }}
              className="flex-1 bh-btn"
            >
              <FaEdit className="w-3.5 h-3.5" />
              Edit Birthday
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  multiline = false,
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">

      <div className="w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--bh-accent) 14%, #fff)", color: "var(--bh-accent)" }}>
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        
        <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
          {label}
        </p>

        <p
          className={`text-sm font-semibold text-gray-700 mt-1 ${
            multiline ? "whitespace-pre-wrap break-words" : "break-all"
          }`}
        >
          {value}
        </p>

      </div>

    </div>
  );
}