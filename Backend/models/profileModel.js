import db from "../config/db.js";

// ==========================================
// CREATE PROFILE
// ==========================================
export const createProfile = async (
  user_id,
  phone,
  gender,
  date_of_birth,
  bio,
  profile_image = null
) => {
  const sql = `
    INSERT INTO profiles
    (
      user_id,
      phone,
      gender,
      date_of_birth,
      bio,
      profile_image
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(sql, [
    user_id,
    phone,
    gender,
    date_of_birth,
    bio,
    profile_image
  ]);

  return result;
};


// ==========================================
// GET PROFILE
// ==========================================
export const getProfileByUserId = async (user_id) => {
  const sql = `
    SELECT
      profiles.id,
      profiles.user_id,
      users.full_name AS full_name,
      users.email AS email,
      profiles.phone,
      profiles.gender,
      profiles.date_of_birth,
      profiles.bio,
      profiles.profile_image,
      profiles.created_at,
      profiles.updated_at
    FROM profiles
    INNER JOIN users
      ON profiles.user_id = users.id
    WHERE profiles.user_id = ?
  `;

  const [rows] = await db.execute(sql, [user_id]);

  return rows[0];
};


// ==========================================
// UPDATE PROFILE DETAILS
// ==========================================
export const updateProfile = async (
  user_id,
  phone,
  gender,
  date_of_birth,
  bio
) => {
  const sql = `
    UPDATE profiles
    SET
      phone = ?,
      gender = ?,
      date_of_birth = ?,
      bio = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `;

  const [result] = await db.execute(sql, [
    phone,
    gender,
    date_of_birth,
    bio,
    user_id
  ]);

  return result;
};


// ==========================================
// UPDATE PROFILE IMAGE
// ==========================================
export const updateProfileImage = async (
  user_id,
  profile_image
) => {
  const sql = `
    UPDATE profiles
    SET
      profile_image = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `;

  const [result] = await db.execute(sql, [
    profile_image,
    user_id
  ]);

  return result;
};