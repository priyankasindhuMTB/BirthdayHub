"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import BirthdayModal from "../../components/BirthdayModal.jsx";
import NotificationBell from "../../components/NotificationBell.jsx";
import BirthdayDetailsModal from "@/components/BirthdayDetailsModal.jsx";
import AppShell from "../../components/AppShell.jsx";

import {
  FaBirthdayCake,
  FaPlus,
  FaEdit,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaStickyNote,
  FaBell,
  FaBellSlash,
  FaCheckCircle,
  FaGift,
  FaUserFriends,
  FaSpinner,
  FaSignOutAlt,
  FaSearch,
  FaClock,
  FaWhatsapp,
  FaEye,
  FaChevronRight,
  FaTimes,
  FaTrashAlt,
  FaStar,
  FaEllipsisV,
} from "react-icons/fa";

import {
  getAllBirthdays,
  updateBirthdayStatus,
  addBirthday,
  updateBirthday,
} from "../../services/birthdayApi.js";

// =====================================================
// HELPER FUNCTIONS
// =====================================================

const getDaysUntilBirthday = (dateString) => {
  if (!dateString) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bd = new Date(dateString);
  const next = new Date(today.getFullYear(), bd.getMonth(), bd.getDate());
  if (next < today) next.setFullYear(today.getFullYear() + 1);
  return Math.ceil((next - today) / 86400000);
};

const getAge = (dateString) => {
  if (!dateString) return null;
  const bd = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - bd.getFullYear();
  const m = today.getMonth() - bd.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--;
  return age;
};

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const avatarColors = [
  "bg-amber-600",
  "bg-rose-600",
  "bg-sky-600",
  "bg-violet-600",
  "bg-emerald-600",
  "bg-orange-600",
  "bg-teal-600",
  "bg-indigo-600",
  "bg-pink-600",
  "bg-cyan-600",
  "bg-lime-600",
  "bg-fuchsia-600",
];

const getAvatarColor = (name) => {
  if (!name) return avatarColors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

const formatDate = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getDaysLabel = (days) => {
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days <= 7) return `${days}d away`;
  if (days <= 30) return `${Math.ceil(days / 7)}w away`;
  return `${Math.ceil(days / 30)}mo away`;
};

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function BirthdaysPage() {
  const router = useRouter();

  // State
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBirthday, setSelectedBirthday] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsBirthday, setDetailsBirthday] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [sortBy, setSortBy] = useState("upcoming");

  // =====================================================
  // API CALLS
  // =====================================================

  const fetchBirthdays = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const data = await getAllBirthdays(token);
      setBirthdays(data.birthdays || []);
    } catch (error) {
      console.error("Failed to fetch birthdays:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchBirthdays();
  }, [fetchBirthdays]);

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      setTogglingId(id);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      await updateBirthdayStatus(token, id, currentStatus === 1 ? 0 : 1);
      await fetchBirthdays();
    } catch (error) {
      console.error("Status update error:", error);
    } finally {
      setTogglingId(null);
    }
  };

  const handleSaveBirthday = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const data = selectedBirthday
        ? await updateBirthday(token, selectedBirthday.id, formData)
        : await addBirthday(token, formData);
      if (data.message) {
        setIsModalOpen(false);
        setSelectedBirthday(null);
        await fetchBirthdays();
      }
    } catch (error) {
      console.error("Save birthday error:", error);
    }
  };

  // =====================================================
  // HANDLERS
  // =====================================================

  const handleAddBirthday = () => {
    setSelectedBirthday(null);
    setIsModalOpen(true);
  };

  const handleEditBirthday = (birthday) => {
    setSelectedBirthday(birthday);
    setIsModalOpen(true);
  };

  const handleViewBirthday = (birthday) => {
    setDetailsBirthday(birthday);
    setIsDetailsOpen(true);
  };

  const handleCall = (phone) => {
    if (phone) window.location.href = `tel:${phone}`;
  };

  const handleEmail = (email) => {
    if (email) window.location.href = `mailto:${email}`;
  };

  const handleWhatsApp = (phone) => {
    if (!phone) return;
    const clean = phone.replace(/\D/g, "");
    const num = clean.length === 10 ? `91${clean}` : clean;
    window.open(`https://wa.me/${num}`, "_blank");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  // =====================================================
  // COMPUTED DATA
  // =====================================================

  const todaysBirthdays = useMemo(
    () =>
      birthdays.filter(
        (b) => getDaysUntilBirthday(b.date_of_birth) === 0 && b.is_active === 1
      ),
    [birthdays]
  );

  const upcomingBirthdays = useMemo(
    () =>
      birthdays
        .filter((b) => {
          const d = getDaysUntilBirthday(b.date_of_birth);
          return d >= 1 && d <= 7 && b.is_active === 1;
        })
        .sort(
          (a, b) =>
            getDaysUntilBirthday(a.date_of_birth) -
            getDaysUntilBirthday(b.date_of_birth)
        ),
    [birthdays]
  );

  const filteredBirthdays = useMemo(() => {
    let filtered = birthdays.filter((b) => {
      const s = searchTerm.toLowerCase();
      const matchSearch =
        b.person_name?.toLowerCase().includes(s) ||
        b.relation?.toLowerCase().includes(s) ||
        b.email?.toLowerCase().includes(s) ||
        b.phone?.includes(s);
      const matchFilter =
        filterStatus === "all" ||
        (filterStatus === "active" && b.is_active === 1) ||
        (filterStatus === "inactive" && b.is_active === 0);
      return matchSearch && matchFilter;
    });

    // Sort
    if (sortBy === "upcoming") {
      filtered.sort((a, b) => {
        const dA = getDaysUntilBirthday(a.date_of_birth) ?? 999;
        const dB = getDaysUntilBirthday(b.date_of_birth) ?? 999;
        return dA - dB;
      });
    } else if (sortBy === "name") {
      filtered.sort((a, b) =>
        (a.person_name || "").localeCompare(b.person_name || "")
      );
    } else if (sortBy === "recent") {
      filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return filtered;
  }, [birthdays, searchTerm, filterStatus, sortBy]);

  const activeCount = birthdays.filter((b) => b.is_active === 1).length;
  const upcomingCount = birthdays.filter((b) => {
    const d = getDaysUntilBirthday(b.date_of_birth);
    return d !== null && d <= 7 && b.is_active === 1;
  }).length;
  const reminderCount = birthdays.filter(
    (b) => b.reminder_enabled === 1
  ).length;

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--bh-bg)" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 rounded-full animate-spin" style={{ borderColor: "var(--bh-line)", borderTopColor: "var(--bh-ink)" }} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Loading</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--bh-muted)" }}>
              Fetching your birthdays…
            </p>
          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <AppShell
      title="Birthdays"
      action={
        <button type="button" onClick={handleAddBirthday} className="bh-btn h-9 text-xs">
          <FaPlus className="w-2.5 h-2.5" />
          <span className="hidden sm:inline">Add Birthday</span>
          <span className="sm:hidden">Add</span>
        </button>
      }
    >
      <div>
        {/* =====================================================
            STATS ROW
        ===================================================== */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <StatCard
            icon={<FaUserFriends className="w-3.5 h-3.5" />}
            label="Total"
            value={birthdays.length}
            iconColor="text-[var(--bh-muted)]"
            iconBg="bg-[var(--bh-bg)]"
          />
          <StatCard
            icon={<FaCheckCircle className="w-3.5 h-3.5" />}
            label="Active"
            value={activeCount}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50"
          />
          <StatCard
            icon={<FaGift className="w-3.5 h-3.5" />}
            label="Upcoming"
            value={upcomingCount}
            iconColor="text-amber-600"
            iconBg="bg-amber-50"
          />
          <StatCard
            icon={<FaBell className="w-3.5 h-3.5" />}
            label="Reminders"
            value={reminderCount}
            iconColor="text-violet-600"
            iconBg="bg-violet-50"
          />
        </div>

        {/* =====================================================
            TODAY'S BIRTHDAYS BANNER
        ===================================================== */}
        {todaysBirthdays.length > 0 && (
          <section className="mb-4 sm:mb-6">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl overflow-hidden">
              {/* Banner Header */}
              <div className="px-4 py-3 border-b border-amber-200/50 flex items-center gap-2.5">
                <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaBirthdayCake className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold text-amber-900">
                    Today&apos;s Birthdays
                  </h2>
                  <p className="text-[10px] text-amber-600">
                    Don&apos;t forget to wish them!
                  </p>
                </div>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex-shrink-0">
                  {todaysBirthdays.length}
                </span>
              </div>

              {/* Birthday List */}
              <div className="p-3 space-y-2">
                {todaysBirthdays.map((b) => {
                  const age = getAge(b.date_of_birth);
                  return (
                    <div
                      key={b.id}
                      className="flex items-center gap-3 bg-white rounded-lg p-3 border border-amber-100/80 shadow-sm"
                    >
                      <div
                        className={`w-10 h-10 ${getAvatarColor(b.person_name)} rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}
                      >
                        {getInitials(b.person_name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-stone-900 truncate">
                          {b.person_name}
                        </p>
                        <p className="text-[11px] text-stone-400 truncate">
                          {b.relation || "—"}
                          {age ? ` · Turns ${age + 1} today 🎂` : " · Birthday today! 🎂"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {b.phone && (
                          <ActionIconButton
                            onClick={() => handleWhatsApp(b.phone)}
                            icon={<FaWhatsapp className="w-3.5 h-3.5" />}
                            title="WhatsApp"
                            colorClass="text-emerald-500 hover:bg-emerald-50"
                          />
                        )}
                        {b.phone && (
                          <ActionIconButton
                            onClick={() => handleCall(b.phone)}
                            icon={<FaPhone className="w-2.5 h-2.5" />}
                            title="Call"
                            colorClass="text-sky-500 hover:bg-sky-50"
                          />
                        )}
                        {b.email && (
                          <ActionIconButton
                            onClick={() => handleEmail(b.email)}
                            icon={<FaEnvelope className="w-3 h-3" />}
                            title="Email"
                            colorClass="text-orange-500 hover:bg-orange-50"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            UPCOMING THIS WEEK
        ===================================================== */}
        {upcomingBirthdays.length > 0 && (
          <section className="mb-4 sm:mb-6">
            <div className="bh-card overflow-hidden">
              {/* Section Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <FaClock className="w-3.5 h-3.5 text-violet-500" />
                  <h2 className="text-sm font-semibold text-stone-800">
                    Coming Up This Week
                  </h2>
                </div>
                <span className="text-[11px] font-medium text-stone-400">
                  {upcomingBirthdays.length}{" "}
                  {upcomingBirthdays.length === 1 ? "birthday" : "birthdays"}
                </span>
              </div>

              {/* Upcoming List */}
              <div className="divide-y divide-stone-50">
                {upcomingBirthdays.map((b) => {
                  const d = getDaysUntilBirthday(b.date_of_birth);
                  const age = getAge(b.date_of_birth);
                  return (
                    <div
                      key={b.id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50/60 transition-colors cursor-pointer group"
                      onClick={() => handleViewBirthday(b)}
                    >
                      <div
                        className={`w-9 h-9 ${getAvatarColor(b.person_name)} rounded-lg flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0`}
                      >
                        {getInitials(b.person_name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-stone-800 truncate group-hover:text-stone-900">
                          {b.person_name}
                        </p>
                        <p className="text-[11px] text-stone-400 truncate">
                          {b.relation || "—"}
                          {age ? ` · Age ${age}` : ""}
                        </p>
                      </div>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md flex-shrink-0 ${
                          d === 1
                            ? "bg-rose-50 text-rose-600 border border-rose-100"
                            : d <= 3
                              ? "bg-amber-50 text-amber-600 border border-amber-100"
                              : "bg-violet-50 text-violet-600 border border-violet-100"
                        }`}
                      >
                        {d === 1 ? "Tomorrow" : `${d} days`}
                      </span>
                      <FaChevronRight className="w-2.5 h-2.5 text-stone-300 group-hover:text-stone-500 transition-colors flex-shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            SEARCH, FILTER & SORT BAR
        ===================================================== */}
        <div className="bh-card p-2.5 sm:p-3 mb-4 sm:mb-5">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-300" />
              <input
                type="text"
                placeholder="Search by name, relation, email or phone…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bh-input"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded text-stone-300 hover:text-stone-500 hover:bg-stone-100 transition-colors"
                >
                  <FaTimes className="w-2.5 h-2.5" />
                </button>
              )}
            </div>

            {/* Filter + Sort */}
            <div className="flex gap-2">
              {/* Status Filter */}
              <div className="flex bg-stone-100 rounded-lg p-0.5 border border-stone-200">
                {["all", "active", "inactive"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium capitalize rounded-md transition-all ${
                      filterStatus === s
                        ? "text-white shadow-sm"
                        : ""
                    }`}
                    style={filterStatus === s ? { background: "var(--bh-ink)" } : { color: "var(--bh-muted)" }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1.5 text-[11px] sm:text-xs font-medium bh-input h-auto"
              >
                <option value="upcoming">Sort: Upcoming</option>
                <option value="name">Sort: Name</option>
                <option value="recent">Sort: Recent</option>
              </select>
            </div>
          </div>
        </div>

        {/* =====================================================
            RESULTS HEADER
        ===================================================== */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-stone-700">
            All Birthdays
          </h2>
          <p className="text-[11px] text-stone-400 font-medium">
            {filteredBirthdays.length} of {birthdays.length} shown
          </p>
        </div>

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}
        {filteredBirthdays.length === 0 ? (
          <div className="bh-card p-8 sm:p-14 text-center">
            <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaBirthdayCake className="w-7 h-7 text-stone-300" />
            </div>
            <h3 className="text-base font-semibold text-stone-800 mb-1">
              {searchTerm || filterStatus !== "all"
                ? "No results found"
                : "No birthdays added yet"}
            </h3>
            <p className="text-sm text-stone-400 mb-6 max-w-sm mx-auto">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search term or changing the filter."
                : "Start by adding your first birthday. We'll make sure you never forget a special day."}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <button
                onClick={handleAddBirthday}
                className="bh-btn"
              >
                <FaPlus className="w-2.5 h-2.5" />
                Add Your First Birthday
              </button>
            )}
          </div>
        ) : (
          /* =====================================================
             BIRTHDAY CARDS GRID
          ===================================================== */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredBirthdays.map((birthday) => (
              <BirthdayCard
                key={birthday.id}
                birthday={birthday}
                daysLeft={getDaysUntilBirthday(birthday.date_of_birth)}
                age={getAge(birthday.date_of_birth)}
                togglingId={togglingId}
                onToggle={handleStatusToggle}
                onView={handleViewBirthday}
                onEdit={handleEditBirthday}
                onCall={handleCall}
                onEmail={handleEmail}
                onWhatsApp={handleWhatsApp}
              />
            ))}
          </div>
        )}
      </div>

      {/* =====================================================
          FLOATING ADD BUTTON (Mobile)
      ===================================================== */}
      <button
        onClick={handleAddBirthday}
        className="fixed bottom-6 right-6 w-12 h-12 text-white rounded-full flex items-center justify-center sm:hidden z-30" style={{ background: "var(--bh-ink)" }}
        title="Add Birthday"
      >
        <FaPlus className="w-4 h-4" />
      </button>

      {/* =====================================================
          MODALS
      ===================================================== */}
      <BirthdayModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBirthday(null);
        }}
        onSubmit={handleSaveBirthday}
        birthday={selectedBirthday}
      />

      <BirthdayDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setDetailsBirthday(null);
        }}
        birthday={detailsBirthday}
        onEdit={handleEditBirthday}
      />
    </AppShell>
  );
}

// =====================================================
// STAT CARD COMPONENT
// =====================================================

function StatCard({ icon, label, value, iconColor, iconBg }) {
  return (
    <div className="bh-card p-3 sm:p-4">
      <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center ${iconColor} mb-2`}>
        {icon}
      </div>
      <p className="text-lg sm:text-2xl font-bold leading-none">
        {value}
      </p>
      <p className="text-[10px] sm:text-xs mt-0.5 font-medium" style={{ color: "var(--bh-muted)" }}>
        {label}
      </p>
    </div>
  );
}

// =====================================================
// ACTION ICON BUTTON
// =====================================================

function ActionIconButton({ onClick, icon, title, colorClass }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${colorClass}`}
    >
      {icon}
    </button>
  );
}

// =====================================================
// BIRTHDAY CARD COMPONENT
// =====================================================

function BirthdayCard({
  birthday,
  daysLeft,
  age,
  togglingId,
  onToggle,
  onView,
  onEdit,
  onCall,
  onEmail,
  onWhatsApp,
}) {
  const isToday = daysLeft === 0;
  const isUpcoming = daysLeft >= 1 && daysLeft <= 7 && birthday.is_active === 1;
  const isInactive = birthday.is_active === 0;

  return (
    <div
      className={`group bh-card transition-all duration-200 hover:shadow-md ${
        isToday
          ? "ring-1 ring-[var(--bh-gold)]"
          : isInactive
            ? "opacity-60 hover:opacity-100"
            : ""
      }`}
    >
      {/* Top accent line */}
      <div
        className={`h-0.5 rounded-t-xl ${
          isToday
            ? "bg-amber-400"
            : isUpcoming
              ? "bg-violet-400"
              : isInactive
                ? "bg-stone-200"
                : "bg-stone-200 group-hover:bg-stone-300"
        } transition-colors`}
      />

      <div className="p-4">
        {/* Card Header */}
        <div className="flex items-start gap-3 mb-3">
          {/* Avatar */}
          <div
            className={`w-11 h-11 ${getAvatarColor(birthday.person_name)} rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm ${
              isInactive ? "grayscale" : ""
            }`}
          >
            {getInitials(birthday.person_name)}
          </div>

          {/* Name & Relation */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-semibold text-stone-900 truncate">
                {birthday.person_name}
              </h3>
              {isToday && (
                <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded flex-shrink-0 uppercase tracking-wider">
                  Today
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-400 truncate mt-0.5">
              {birthday.relation || "—"}
              {age ? ` · ${age} yrs` : ""}
            </p>
          </div>

          {/* Toggle */}
          <button
            onClick={() => onToggle(birthday.id, birthday.is_active)}
            disabled={togglingId === birthday.id}
            title={birthday.is_active === 1 ? "Deactivate" : "Activate"}
            className={`relative w-9 h-[22px] rounded-full transition-colors flex-shrink-0 ${
              birthday.is_active === 1 ? "bg-emerald-500" : "bg-stone-200"
            } ${togglingId === birthday.id ? "opacity-50" : ""}`}
          >
            <span
              className={`absolute top-[3px] w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                birthday.is_active === 1 ? "left-[18px]" : "left-[3px]"
              }`}
            />
          </button>
        </div>

        {/* Countdown Badge */}
        {daysLeft !== null && birthday.is_active === 1 && !isToday && (
          <div
            className={`mb-3 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 ${
              isUpcoming
                ? "bg-violet-50 text-violet-600 border border-violet-100"
                : "bg-stone-50 text-stone-500 border border-stone-100"
            }`}
          >
            <FaGift className={`w-3 h-3 ${isUpcoming ? "text-violet-400" : "text-stone-400"}`} />
            <span>{getDaysLabel(daysLeft)}</span>
            {daysLeft === 1 && <span className="ml-auto">🎉</span>}
          </div>
        )}

        {/* Info Rows */}
        <div className="space-y-1.5 mb-3">
          <InfoRow
            icon={<FaCalendarAlt className="w-3 h-3" />}
            value={formatDate(birthday.date_of_birth)}
          />

          {birthday.phone && (
            <InfoRow
              icon={<FaPhone className="w-3 h-3" />}
              value={birthday.phone}
            />
          )}

          {birthday.email && (
            <InfoRow
              icon={<FaEnvelope className="w-3 h-3" />}
              value={birthday.email}
              truncate
            />
          )}

          {birthday.notes && (
            <InfoRow
              icon={<FaStickyNote className="w-3 h-3" />}
              value={birthday.notes}
              truncate
              muted
            />
          )}

          <div className="flex items-center gap-2 text-[11px]">
            {birthday.reminder_enabled === 1 ? (
              <>
                <div className="w-5 h-5 rounded flex items-center justify-center bg-violet-50 flex-shrink-0">
                  <FaBell className="w-2.5 h-2.5 text-violet-500" />
                </div>
                <span className="text-violet-600 font-medium">Reminder on</span>
              </>
            ) : (
              <>
                <div className="w-5 h-5 rounded flex items-center justify-center bg-stone-50 flex-shrink-0">
                  <FaBellSlash className="w-2.5 h-2.5 text-stone-300" />
                </div>
                <span className="text-stone-400">No reminder</span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 pt-3 border-t border-stone-100">
          {/* Contact Actions */}
          {birthday.phone && (
            <ActionIconButton
              onClick={() => onCall(birthday.phone)}
              icon={<FaPhone className="w-2.5 h-2.5" />}
              title="Call"
              colorClass="text-sky-500 hover:bg-sky-50"
            />
          )}
          {birthday.phone && (
            <ActionIconButton
              onClick={() => onWhatsApp(birthday.phone)}
              icon={<FaWhatsapp className="w-3.5 h-3.5" />}
              title="WhatsApp"
              colorClass="text-emerald-500 hover:bg-emerald-50"
            />
          )}
          {birthday.email && (
            <ActionIconButton
              onClick={() => onEmail(birthday.email)}
              icon={<FaEnvelope className="w-3 h-3" />}
              title="Email"
              colorClass="text-orange-500 hover:bg-orange-50"
            />
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* View & Edit */}
          <ActionIconButton
            onClick={() => onView(birthday)}
            icon={<FaEye className="w-3 h-3" />}
            title="View Details"
            colorClass="text-stone-400 hover:text-stone-600 hover:bg-stone-100"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(birthday);
            }}
            title="Edit"
            className="flex items-center gap-1 h-8 px-2.5 rounded-lg text-[11px] font-medium text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <FaEdit className="w-3 h-3" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// INFO ROW COMPONENT
// =====================================================

function InfoRow({ icon, value, truncate, muted }) {
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <div className="w-5 h-5 rounded flex items-center justify-center bg-stone-50 text-stone-400 flex-shrink-0">
        {icon}
      </div>
      <span
        className={`${truncate ? "truncate" : ""} ${
          muted ? "text-stone-400 italic" : "text-stone-600"
        } flex-1`}
        title={value}
      >
        {value}
      </span>
    </div>
  );
}