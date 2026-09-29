import db from "../config/db.js";

// ==========================================
// CREATE BIRTHDAY
// ==========================================
export const createBirthday = async (
  user_id,
  person_name,
  relation,
  date_of_birth,
  phone,
  email,
  notes,
  reminder_enabled
) => {
  const sql = `
    INSERT INTO birthdays
    (
      user_id,
      person_name,
      relation,
      date_of_birth,
      phone,
      email,
      notes,
      reminder_enabled,
      is_active
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(sql, [
    user_id,
    person_name,
    relation,
    date_of_birth,
    phone,
    email,
    notes,
    reminder_enabled,
    1
  ]);

  return result;
};


// ==========================================
// GET ALL BIRTHDAYS OF LOGGED-IN USER
// ==========================================
export const getBirthdaysByUserId = async (user_id) => {
  const sql = `
    SELECT *
    FROM birthdays
    WHERE user_id = ?
    ORDER BY date_of_birth ASC
  `;

  const [rows] = await db.execute(sql, [user_id]);

  return rows;
};


// ==========================================
// UPDATE BIRTHDAY DETAILS
// ==========================================
export const updateBirthday = async (
  id,
  user_id,
  person_name,
  relation,
  date_of_birth,
  phone,
  email,
  notes,
  reminder_enabled
) => {
  const sql = `
    UPDATE birthdays
    SET
      person_name = ?,
      relation = ?,
      date_of_birth = ?,
      phone = ?,
      email = ?,
      notes = ?,
      reminder_enabled = ?
    WHERE id = ?
      AND user_id = ?
  `;

  const [result] = await db.execute(sql, [
    person_name,
    relation,
    date_of_birth,
    phone,
    email,
    notes,
    reminder_enabled,
    id,
    user_id
  ]);

  return result;
};


// ==========================================
// UPDATE ACTIVE / INACTIVE STATUS
// ==========================================
export const updateBirthdayStatus = async (
  id,
  user_id,
  is_active
) => {
  const sql = `
    UPDATE birthdays
    SET is_active = ?
    WHERE id = ?
      AND user_id = ?
  `;

  const [result] = await db.execute(sql, [
    is_active,
    id,
    user_id
  ]);

  return result;
};


// ==========================================
// GET BIRTHDAYS FOR REMINDER
// ==========================================
export const getBirthdaysForReminder = async () => {
  const sql = `
    SELECT *
    FROM birthdays
    WHERE is_active = 1
      AND reminder_enabled = 1
  `;

  const [rows] = await db.execute(sql);

  return rows;
};


// ==========================================
// GET TODAY'S BIRTHDAYS
// ==========================================
export const getTodaysBirthdays = async () => {
  const sql = `
    SELECT *
    FROM birthdays
    WHERE is_active = 1
      AND reminder_enabled = 1
      AND MONTH(date_of_birth) = MONTH(CURDATE())
      AND DAY(date_of_birth) = DAY(CURDATE())
  `;

  const [rows] = await db.execute(sql);

  return rows;
};