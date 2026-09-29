import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const profileAPI = axios.create({
  baseURL: API_URL,
 
});

// GET PROFILE
export const getProfile = async (token) => {
  const response = await profileAPI.get(
    "/api/profile/get-profile",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// CREATE PROFILE
export const createProfile = async (token, profileData) => {
  const response = await profileAPI.post(
    "/api/profile/add-profile",
    profileData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// UPDATE PROFILE
export const updateProfile = async (token, profileData) => {
  const response = await profileAPI.put(
    "/api/profile/edit-profile",
    profileData,
    {
      headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
    }
  );

  return response.data;
};


export const uploadProfileImage = async (token, imageFile) => {
    const formData = new FormData();

    formData.append("profile_image", imageFile);

    const response = await profileAPI.post(
        "/api/profile/upload-image",
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};