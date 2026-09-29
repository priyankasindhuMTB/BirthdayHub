import db from "../config/db.js";

export const createNotification = async (
  user_id,
  birthday_id,
  title,
  message
) => {
  const checkSql = `
    SELECT id
    FROM notifications
    WHERE user_id = ?
      AND birthday_id = ?
      AND DATE(created_at) = CURDATE()
    LIMIT 1
  `;

  const [existing] = await db.execute(checkSql, [
    user_id,
    birthday_id,
  ]);

  if (existing.length > 0) {
    return {
      alreadyExists: true,
      id: existing[0].id,
    };
  }

  const insertSql = `
    INSERT INTO notifications
    (
      user_id,
      birthday_id,
      title,
      message
    )
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await db.execute(insertSql, [
    user_id,
    birthday_id,
    title,
    message,
  ]);

  return {
    alreadyExists: false,
    id: result.insertId,
  };
};


export const getNotificationsByUserId = async (user_id) => {
  const sql = `
    SELECT *
    FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  const [rows] = await db.execute(sql, [user_id]);

  return rows;
};
export const getUnreadNotificationCount = async (user_id) => {
  const sql = `
    SELECT COUNT(*) AS unreadCount
    FROM notifications
    WHERE user_id = ?
      AND is_read = 0
  `;

  const [rows] = await db.execute(sql, [user_id]);

  return rows[0].unreadCount;
};
export const markNotificationAsRead = async (
  notification_id,
  user_id
) => {
  const sql = `
    UPDATE notifications
    SET is_read = 1
    WHERE id = ?
      AND user_id = ?
  `;

  const [result] = await db.execute(sql, [
    notification_id,
    user_id
  ]);

  return result;
};