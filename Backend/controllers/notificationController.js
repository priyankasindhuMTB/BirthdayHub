import { getNotificationsByUserId, getUnreadNotificationCount, markNotificationAsRead } from "../models/notificationModel.js";

export const getNotifications = async (req, res) => {
  try {
    const user_id = req.user.id;

    const notifications =
      await getNotificationsByUserId(user_id);

    res.status(200).json({
      message: "Notifications fetched successfully",
      notifications
    });

  } catch (error) {
    console.error("Get notifications error:", error);

    res.status(500).json({
      message: "Failed to fetch notifications"
    });
  }
};
export const getUnreadCount = async (req, res) => {
  try {
    const user_id = req.user.id;

    const unreadCount =
      await getUnreadNotificationCount(user_id);

    res.status(200).json({
      unreadCount
    });

  } catch (error) {
    console.error("Unread notification error:", error);

    res.status(500).json({
      message: "Failed to fetch unread count"
    });
  }
};


export const markAsRead = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;

    const result = await markNotificationAsRead(
      id,
      user_id
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Notification not found"
      });
    }

    res.status(200).json({
      message: "Notification marked as read"
    });

  } catch (error) {
    console.error("Mark notification error:", error);

    res.status(500).json({
      message: "Failed to mark notification as read"
    });
  }
};