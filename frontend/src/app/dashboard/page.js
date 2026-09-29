"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaBirthdayCake,
  FaUsers,
  FaCheckCircle,
  FaGift,
  FaBell,
  FaArrowRight,
  FaPlus,
  FaClock,
  FaUserCircle,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { getAllBirthdays } from "../../services/birthdayApi.js";
import {
  getNotifications,
  getUnreadNotificationCount,
} from "../../services/notificationApi.js";
import { getProfile } from "../../services/profileApi.js";
import AppShell from "../../components/AppShell.jsx";

export default function DashboardPage() {
  const router = useRouter();
  const [birthdays, setBirthdays] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        setLoading(true);
        setError("");
        const birthdayData = await getAllBirthdays(token);
        setBirthdays(birthdayData.birthdays || []);
        const notificationData = await getNotifications(token);
        setNotifications(notificationData.notifications || []);
        const unreadData = await getUnreadNotificationCount(token);
        setUnreadCount(unreadData.unreadCount || 0);
        try {
          const profileData = await getProfile(token);
          setProfile(profileData.profile || null);
        } catch (profileError) {
          console.log("Profile not available:", profileError);
        }
      } catch (error) {
        console.error("Dashboard loading error:", error);
        setError("Unable to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [router]);

  const getDaysUntilBirthday = (dateString) => {
    if (!dateString) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const birthDate = new Date(dateString);
    const nextBirthday = new Date(
      today.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate()
    );
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    return Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
  };

  const todaysBirthdays = birthdays.filter((birthday) => {
    const days = getDaysUntilBirthday(birthday.date_of_birth);
    return days === 0 && birthday.is_active === 1;
  });

  const upcomingBirthdays = birthdays
    .filter((birthday) => {
      const days = getDaysUntilBirthday(birthday.date_of_birth);
      return days !== null && days >= 1 && days <= 7 && birthday.is_active === 1;
    })
    .sort(
      (a, b) =>
        getDaysUntilBirthday(a.date_of_birth) -
        getDaysUntilBirthday(b.date_of_birth)
    );

  const totalBirthdays = birthdays.length;
  const activeBirthdays = birthdays.filter((birthday) => birthday.is_active === 1).length;

  const savedUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;
  const userName = profile?.full_name || savedUser?.full_name || "Friend";

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center" style={{ background: "var(--bh-bg)" }}>
        <div className="bh-card px-10 py-8 text-center">
          <FaSpinner className="mx-auto mb-3 animate-spin text-[var(--bh-accent)]" />
          <p className="font-semibold">Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <AppShell
      title={`Welcome, ${userName}`}
      action={
        <button type="button" className="bh-btn" onClick={() => router.push("/birthdays")}>
          <FaPlus /> Add
        </button>
      }
    >
      {error && (
        <div className="bh-error mb-5">
          <FaExclamationCircle />
          <span>{error}</span>
        </div>
      )}

      <p className="text-[13px] mb-5" style={{ color: "var(--bh-muted)" }}>
        Here&apos;s what&apos;s happening with your birthdays.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <DashboardStat icon={<FaUsers />} label="Total Birthdays" value={totalBirthdays} />
        <DashboardStat icon={<FaCheckCircle />} label="Active" value={activeBirthdays} />
        <DashboardStat icon={<FaGift />} label="Next 7 Days" value={upcomingBirthdays.length} />
        <DashboardStat icon={<FaBell />} label="Unread" value={unreadCount} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        <section className="bh-card overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between" style={{ background: "var(--bh-ink)", color: "#fff" }}>
            <div>
              <h2 className="text-base font-bold">Today&apos;s Birthdays</h2>
              <p className="text-xs opacity-70 mt-1">Don&apos;t forget to wish them!</p>
            </div>
            <FaBirthdayCake />
          </div>
          <div className="p-5">
            {todaysBirthdays.length === 0 ? (
              <div className="bh-empty">
                <FaBirthdayCake className="mx-auto mb-2" />
                <p className="font-semibold text-[var(--bh-text)]">No birthdays today</p>
                <p className="text-xs mt-1">Enjoy your day!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todaysBirthdays.map((birthday) => (
                  <div key={birthday.id} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: "var(--bh-line)" }}>
                    <div className="w-10 h-10 rounded-xl grid place-items-center text-white" style={{ background: "var(--bh-accent)" }}>
                      <FaBirthdayCake />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{birthday.person_name}</p>
                      <p className="text-xs font-semibold" style={{ color: "var(--bh-accent)" }}>
                        {birthday.relation || "Special Person"}
                      </p>
                    </div>
                    <span className="text-xs font-bold" style={{ color: "var(--bh-warn)" }}>Today</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bh-card overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--bh-line)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl grid place-items-center text-white" style={{ background: "var(--bh-accent)" }}>
                <FaBell />
              </div>
              <div>
                <h2 className="font-bold">Recent Notifications</h2>
                <p className="text-xs" style={{ color: "var(--bh-muted)" }}>Your latest reminders</p>
              </div>
            </div>
            <button type="button" className="text-xs font-bold" style={{ color: "var(--bh-accent)" }} onClick={() => router.push("/Notification")}>
              View all
            </button>
          </div>
          <div className="p-5">
            {notifications.length === 0 ? (
              <div className="bh-empty">
                <FaBell className="mx-auto mb-2" />
                <p className="font-semibold">No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.slice(0, 4).map((notification) => (
                  <div key={notification.id} className="flex gap-3 p-3 rounded-xl" style={{ background: "var(--bh-bg)" }}>
                    <div className="w-9 h-9 rounded-lg grid place-items-center flex-shrink-0" style={{ background: "color-mix(in srgb, var(--bh-accent) 16%, #fff)", color: "var(--bh-accent)" }}>
                      <FaBell className="text-sm" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate">{notification.title}</p>
                      <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--bh-muted)" }}>{notification.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="bh-card overflow-hidden mb-5">
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--bh-line)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl grid place-items-center text-white" style={{ background: "var(--bh-ink)" }}>
              <FaGift />
            </div>
            <div>
              <h2 className="text-base font-bold">Upcoming Birthdays</h2>
              <p className="text-xs" style={{ color: "var(--bh-muted)" }}>Birthdays in the next 7 days</p>
            </div>
          </div>
          <button type="button" className="text-xs font-bold flex items-center gap-1" style={{ color: "var(--bh-accent)" }} onClick={() => router.push("/birthdays")}>
            View all <FaArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="p-5">
          {upcomingBirthdays.length === 0 ? (
            <div className="bh-empty">
              <FaGift className="mx-auto mb-2" />
              <p className="font-semibold text-[var(--bh-text)]">No upcoming birthdays</p>
              <p className="text-xs mt-1">Nothing coming up in the next 7 days.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {upcomingBirthdays.map((birthday) => {
                const daysLeft = getDaysUntilBirthday(birthday.date_of_birth);
                return (
                  <div key={birthday.id} className="flex items-center gap-3 p-4 rounded-xl border" style={{ borderColor: "var(--bh-line)" }}>
                    <div className="w-12 h-12 rounded-xl grid place-items-center text-white flex-shrink-0" style={{ background: "var(--bh-accent)" }}>
                      <FaBirthdayCake />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{birthday.person_name}</p>
                      <p className="text-xs font-semibold truncate" style={{ color: "var(--bh-accent)" }}>
                        {birthday.relation || "Special Person"}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: "var(--bh-muted)" }}>
                        <FaClock className="w-3 h-3" />
                        <span>{daysLeft === 1 ? "Tomorrow" : `In ${daysLeft} days`}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <HiSparkles style={{ color: "var(--bh-gold)" }} />
          <h2 className="text-lg font-bold">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <QuickAction icon={<FaPlus />} title="Add Birthday" description="Add a new special person" onClick={() => router.push("/birthdays")} />
          <QuickAction icon={<FaBirthdayCake />} title="View Birthdays" description="Manage all birthdays" onClick={() => router.push("/birthdays")} />
          <QuickAction icon={<FaUserCircle />} title="My Profile" description="View or edit your profile" onClick={() => router.push("/profile")} />
        </div>
      </section>
    </AppShell>
  );
}

function DashboardStat({ icon, label, value }) {
  return (
    <div className="bh-card bh-stat">
      <div className="ico">{icon}</div>
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

function QuickAction({ icon, title, description, onClick }) {
  return (
    <button type="button" onClick={onClick} className="bh-card p-5 text-left hover:-translate-y-0.5 transition-transform">
      <div className="w-11 h-11 rounded-xl grid place-items-center text-white mb-4" style={{ background: "var(--bh-ink)" }}>
        {icon}
      </div>
      <h3 className="font-bold">{title}</h3>
      <p className="text-xs mt-1" style={{ color: "var(--bh-muted)" }}>{description}</p>
    </button>
  );
}
