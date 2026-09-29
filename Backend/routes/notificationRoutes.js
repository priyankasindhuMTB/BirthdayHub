import express from "express";

import {
  getNotifications,
  getUnreadCount,
  markAsRead
} from "../controllers/notificationController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

const NotificationRouter = express.Router();

NotificationRouter.get(
  "/",
  authenticateToken,
  getNotifications
);

NotificationRouter.get(
  "/unread-count",
  authenticateToken,
  getUnreadCount
);

NotificationRouter.put(
  "/:id/read",
  authenticateToken,
  markAsRead
);

export default NotificationRouter;