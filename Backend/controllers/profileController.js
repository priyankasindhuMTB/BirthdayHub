import { createProfile,getProfileByUserId,updateProfile, updateProfileImage } from "../models/profileModel.js";

export const addProfile = async (req, res) => {
  try {
    const user_id = req.user.id;

    const {
      phone,
      gender,
      date_of_birth,
      bio,
      profile_image
    } = req.body;

    const result = await createProfile(
      user_id,
      phone,
      gender,
      date_of_birth,
      bio,
      profile_image
    );

    res.status(201).json({
      message: "Profile created successfully",
      result
    });

  } catch (error) {
    console.error("Profile Error:", error);

    res.status(500).json({
      message: "Failed to create profile",
      error: error.message
    });
  }
};
export const getProfile = async (req, res) => {
  try {
    const user_id = req.user.id;
    console.log("PROFILE CONTROLLER USER ID:", user_id);

    const profile = await getProfileByUserId(user_id);
    console.log("PROFILE CONTROLLER PROFILE:", profile);

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found"
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      profile
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message
    });
  }
};

export const editProfile = async (req, res) => {
  try {

    const user_id = req.user.id;

    const {
      phone,
      gender,
      date_of_birth,
      bio,
      profile_image
    } = req.body;

    const result = await updateProfile(
      user_id,
      phone,
      gender,
      date_of_birth,
      bio,
      profile_image
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Profile not found"
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      result
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to update profile",
      error: error.message
    });

  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    const user_id = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        message: "Please select a profile image",
      });
    }

    const profileImage = `uploads/profile/${req.file.filename}`;

    const result = await updateProfileImage(
      user_id,
      profileImage
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.status(200).json({
      message: "Profile image uploaded successfully",
      profile_image: profileImage,
    });
  } catch (error) {
    console.error(
      "Upload Profile Image Error:",
      error
    );

    res.status(500).json({
      message: "Failed to upload profile image",
      error: error.message,
    });
  }
};