import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(
  "/api/birthday",
  ""
);

const notificationAPI = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getNotifications = async (token) => {
  const response = await notificationAPI.get(
    "/api/notifications",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getUnreadNotificationCount = async (token) => {
  const response = await notificationAPI.get(
    "/api/notifications/unread-count",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const markNotificationAsRead = async (
  token,
  notificationId
) => {
  const response = await notificationAPI.put(
    `/api/notifications/${notificationId}/read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};