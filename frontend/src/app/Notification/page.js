"use client";

import AppShell from "../../components/AppShell.jsx";
import NotificationBell from "../../components/NotificationBell.jsx";

export default function NotificationPage() {
  return (
    <AppShell title="Notifications">
      <div className="bh-card p-6 mb-5">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--bh-muted)" }}>
          View your birthday reminders and notifications.
        </p>
      </div>
      <div className="bh-card p-10 grid place-items-center">
        <NotificationBell />
      </div>
    </AppShell>
  );
}
