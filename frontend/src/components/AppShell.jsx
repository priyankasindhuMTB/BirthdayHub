"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaBirthdayCake,
  FaThLarge,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import NotificationBell from "./NotificationBell.jsx";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: FaThLarge },
  { href: "/birthdays", label: "Birthdays", icon: FaBirthdayCake },
  { href: "/Notification", label: "Notifications", icon: FaBell },
  { href: "/profile", label: "Profile", icon: FaUserCircle },
];

export default function AppShell({ title, action, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="bh-shell">
      <div className={`bh-overlay ${open ? "open" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`bh-sidebar ${open ? "open" : ""}`}>
        <div className="bh-brand">
          <div className="bh-brand-mark">
            <FaBirthdayCake />
          </div>
          <div>
            <h1>BirthdayHub</h1>
            <p>Studio</p>
          </div>
        </div>
        <nav className="bh-nav">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={pathname === href ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              <Icon />
              {label}
            </Link>
          ))}
        </nav>
        <div className="bh-nav-foot">
          <button type="button" className="bh-nav-item" onClick={logout}>
            <FaSignOutAlt />
            Sign out
          </button>
        </div>
      </aside>

      <div className="bh-main">
        <header className="bh-topbar">
          <div className="flex items-center gap-3 min-w-0">
            <button type="button" className="bh-icon-btn bh-menu" onClick={() => setOpen(true)} aria-label="Open menu">
              {open ? <FaTimes /> : <FaBars />}
            </button>
            <h2 className="truncate">{title}</h2>
          </div>
          <div className="flex items-center gap-2">
            {action}
            <NotificationBell />
          </div>
        </header>
        <div className="bh-content">{children}</div>
      </div>
    </div>
  );
}
