"use client";

import { useEffect, useState, useRef } from "react";
import { FaBell, FaBirthdayCake, FaRegBellSlash } from "react-icons/fa";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
} from "../services/notificationApi.js";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Get token
  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };

  // Load notification count
  const loadUnreadCount = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const data = await getUnreadNotificationCount(token);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Failed to load notification count:", error);
    }
  };

  // Load notifications
  const loadNotifications = async () => {
    try {
      const token = getToken();
      if (!token) return;
      setLoading(true);
      const data = await getNotifications(token);
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load + refresh every minute
// Initial load + automatic notification refresh
useEffect(() => {
  loadUnreadCount();

  const interval = setInterval(() => {
    loadUnreadCount();
  }, 10000);

  return () => clearInterval(interval);
}, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Open notification dropdown
  const handleBellClick = async () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (newState) {
      await loadNotifications();
    }
  };

  // Mark notification as read
  const handleNotificationClick = async (notification) => {
    try {
      const token = getToken();
      if (!token) return;

      if (notification.is_read === 0) {
        await markNotificationAsRead(token, notification.id);

        setNotifications((prev) =>
          prev.map((item) =>
            item.id === notification.id ? { ...item, is_read: 1 } : item
          )
        );

        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Format relative time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={handleBellClick}
        className="bh-icon-btn relative"
      >
        <FaBell className="w-4 h-4" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <>
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white ring-2 ring-white" style={{ background: "var(--bh-danger)" }}>
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
            <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-red-400 animate-ping opacity-75" />
          </>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 z-[998] bg-black/20 backdrop-blur-sm sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div className="bh-card fixed sm:absolute right-4 sm:right-0 top-20 sm:top-14 z-[999] w-[calc(100vw-2rem)] sm:w-96 max-w-md overflow-hidden">
            {/* Header */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0" style={{ background: "var(--bh-ink)" }} />
              <div className="relative flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-2">
                  <FaBell className="w-4 h-4 text-white" />
                  <h3 className="font-bold text-white">Notifications</h3>
                </div>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold bg-white/25 backdrop-blur text-white px-2.5 py-1 rounded-full border border-white/30">
                    {unreadCount} new
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[400px] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                  <p className="mt-3 text-sm text-gray-500 font-medium">
                    Loading...
                  </p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-3">
                    <FaRegBellSlash className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 font-semibold">
                    No notifications
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    You&apos;re all caught up! 🎉
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => handleNotificationClick(notification)}
                      className="w-full px-4 py-3 text-left"
                      style={{ background: notification.is_read === 0 ? "var(--bh-bg)" : "var(--bh-surface)" }}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--bh-accent)" }}>
                            <FaBirthdayCake className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`text-sm font-bold truncate ${
                                notification.is_read === 0
                                  ? "text-gray-900"
                                  : "text-gray-700"
                              }`}
                            >
                              {notification.title}
                            </p>
                            {notification.is_read === 0 && (
                              <span className="mt-1.5 h-2 w-2 rounded-full bg-purple-600 flex-shrink-0 animate-pulse" />
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-gray-600 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="mt-1.5 text-[10px] text-gray-400 font-medium">
                            {formatTime(notification.created_at)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-gray-100 px-4 py-2.5 bg-gray-50/50 text-center">
                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                  {notifications.length} total notifications
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}