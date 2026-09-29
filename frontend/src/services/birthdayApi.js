import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Get active birthdays
export const getAllBirthdays = async (token) => {
  const response = await axios.get(
    `${API_URL}/get-all-birthday`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// Add birthday
export const addBirthday = async (
  token,
  birthdayData
) => {
  const response = await axios.post(
    `${API_URL}/create-birthday`,
    birthdayData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};


// Update birthday details
export const updateBirthday = async (
  token,
  id,
  birthdayData
) => {
  const response = await axios.put(
    `${API_URL}/update-birthday/${id}`,
    birthdayData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};


// Toggle Active / Inactive
export const updateBirthdayStatus = async (
  token,
  id,
  is_active
) => {
  const response = await axios.patch(
    `${API_URL}/update-status/${id}`,
    {
      is_active,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};