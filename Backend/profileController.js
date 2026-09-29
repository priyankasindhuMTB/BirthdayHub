import {
  createProfile,
  getProfileByUserId,
  updateProfile,
  updateProfileImage
} from "../models/profileModel.js";


// ==========================================
// CREATE PROFILE
// ==========================================
export const addProfile = async (req, res) => {
  try {
    const user_id = req.user.id;

    const {
      phone,
      gender,
      date_of_birth,
      bio
    } = req.body;

    const profile_image = null;

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
    console.error("Create Profile Error:", error);

    res.status(500).json({
      message: "Failed to create profile",
      error: error.message
    });
  }
};


// ==========================================
// GET PROFILE
// ==========================================
export const getProfile = async (req, res) => {
  try {
    const user_id = req.user.id;

    const profile = await getProfileByUserId(user_id);

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
    console.error("Get Profile Error:", error);

    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message
    });
  }
};


// ==========================================
// EDIT PROFILE
// ==========================================
export const editProfile = async (req, res) => {
  try {
    const user_id = req.user.id;

    const {
      phone,
      gender,
      date_of_birth,
      bio
    } = req.body;


    // ==========================================
    // PHONE VALIDATION
    // ==========================================
    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        message: "Phone number must contain exactly 10 digits"
      });
    }


    // ==========================================
    // GENDER VALIDATION
    // ==========================================
    const allowedGenders = [
      "Male",
      "Female",
      "Other"
    ];

    if (!gender || !allowedGenders.includes(gender)) {
      return res.status(400).json({
        message: "Please select a valid gender"
      });
    }


    // ==========================================
    // DATE OF BIRTH VALIDATION
    // ==========================================
    if (!date_of_birth) {
      return res.status(400).json({
        message: "Date of birth is required"
      });
    }

    const selectedDate = new Date(date_of_birth);

    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date of birth"
      });
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      return res.status(400).json({
        message: "Date of birth cannot be a future date"
      });
    }


    // ==========================================
    // BIO VALIDATION
    // ==========================================
    if (!bio || bio.trim().length < 3) {
      return res.status(400).json({
        message: "Bio must contain at least 3 characters"
      });
    }

    if (bio.trim().length > 500) {
      return res.status(400).json({
        message: "Bio cannot exceed 500 characters"
      });
    }


    // ==========================================
    // UPDATE PROFILE
    // ==========================================
    const result = await updateProfile(
      user_id,
      phone.trim(),
      gender,
      date_of_birth,
      bio.trim()
    );


    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Profile not found"
      });
    }


    res.status(200).json({
      message: "Profile updated successfully"
    });

  } catch (error) {
    console.error("Edit Profile Error:", error);

    res.status(500).json({
      message: "Failed to update profile",
      error: error.message
    });
  }
};


// ==========================================
// UPLOAD PROFILE IMAGE
// ==========================================
export const uploadProfileImage = async (req, res) => {
  try {
    const user_id = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        message: "Please select an image"
      });
    }

    const profileImage = `uploads/profile/${req.file.filename}`;

    const result = await updateProfileImage(
      user_id,
      profileImage
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Profile not found"
      });
    }

    res.status(200).json({
      message: "Profile image uploaded successfully",
      profile_image: profileImage
    });

  } catch (error) {
    console.error("Profile Image Error:", error);

    res.status(500).json({
      message: "Failed to upload profile image",
      error: error.message
    });
  }
};