import {
  createBirthday,
  getBirthdaysByUserId,
  updateBirthday,
  updateBirthdayStatus,
  getBirthdaysForReminder,
  getTodaysBirthdays,
} from "../models/birthdayModel.js";


// ==========================================
// CREATE BIRTHDAY
// ==========================================
export const addBirthday = async (req, res) => {
  try {
    const user_id = req.user.id;

    const {
      person_name,
      relation,
      date_of_birth,
      phone,
      email,
      notes,
      reminder_enabled,
    } = req.body;


    // ======================================
    // PERSON NAME
    // ======================================
    if (!person_name || person_name.trim().length < 2) {
      return res.status(400).json({
        message: "Person name must be at least 2 characters",
      });
    }


    // ======================================
    // RELATION
    // ======================================
    if (!relation || relation.trim().length === 0) {
      return res.status(400).json({
        message: "Relation is required",
      });
    }


    // ======================================
    // DATE OF BIRTH
    // ======================================
    if (!date_of_birth) {
      return res.status(400).json({
        message: "Date of birth is required",
      });
    }

    const birthDate = new Date(date_of_birth);

    if (Number.isNaN(birthDate.getTime())) {
      return res.status(400).json({
        message: "Please enter a valid date of birth",
      });
    }


    // ======================================
    // PHONE
    // ======================================
    if (
      phone !== undefined &&
      phone !== null &&
      phone !== "" &&
      !/^[0-9]{10}$/.test(String(phone).trim())
    ) {
      return res.status(400).json({
        message: "Phone number must be exactly 10 digits",
      });
    }


    // ======================================
    // EMAIL
    // ======================================
    if (
      email !== undefined &&
      email !== null &&
      email !== "" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())
    ) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }


    // ======================================
    // REMINDER
    // ======================================
    if (
      reminder_enabled !== undefined &&
      reminder_enabled !== 0 &&
      reminder_enabled !== 1
    ) {
      return res.status(400).json({
        message: "reminder_enabled must be 0 or 1",
      });
    }


    // ======================================
    // CREATE
    // ======================================
    const result = await createBirthday(
      user_id,
      person_name.trim(),
      relation.trim(),
      date_of_birth,
      phone ? String(phone).trim() : null,
      email ? String(email).trim() : null,
      notes ? notes.trim() : null,
      reminder_enabled ?? 0
    );


    res.status(201).json({
      message: "Birthday added successfully",
      result,
    });

  } catch (error) {
    console.error("Birthday Error:", error);

    res.status(500).json({
      message: "Failed to add birthday",
      error: error.message,
    });
  }
};



// ==========================================
// GET ALL BIRTHDAYS
// ==========================================
export const getAllBirthday = async (req, res) => {
  try {
    const user_id = req.user.id;

    const birthdays = await getBirthdaysByUserId(user_id);

    res.status(200).json({
      message: "Birthdays fetched successfully",
      birthdays,
    });

  } catch (error) {
    console.error("Get birthdays error:", error);

    res.status(500).json({
      message: "Failed to fetch birthdays",
      error: error.message,
    });
  }
};



// ==========================================
// EDIT BIRTHDAY
// ==========================================
export const editBirthday = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;

    const {
      person_name,
      relation,
      date_of_birth,
      phone,
      email,
      notes,
      reminder_enabled,
    } = req.body;


    // ======================================
    // PERSON NAME
    // ======================================
    if (!person_name || person_name.trim().length < 2) {
      return res.status(400).json({
        message: "Person name must be at least 2 characters",
      });
    }


    // ======================================
    // RELATION
    // ======================================
    if (!relation || relation.trim().length === 0) {
      return res.status(400).json({
        message: "Relation is required",
      });
    }


    // ======================================
    // DATE OF BIRTH
    // ======================================
    if (!date_of_birth) {
      return res.status(400).json({
        message: "Date of birth is required",
      });
    }

    const birthDate = new Date(date_of_birth);

    if (Number.isNaN(birthDate.getTime())) {
      return res.status(400).json({
        message: "Please enter a valid date of birth",
      });
    }


    // ======================================
    // PHONE
    // ======================================
    if (
      phone !== undefined &&
      phone !== null &&
      phone !== "" &&
      !/^[0-9]{10}$/.test(String(phone).trim())
    ) {
      return res.status(400).json({
        message: "Phone number must be exactly 10 digits",
      });
    }


    // ======================================
    // EMAIL
    // ======================================
    if (
      email !== undefined &&
      email !== null &&
      email !== "" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())
    ) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }


    // ======================================
    // REMINDER
    // ======================================
    if (
      reminder_enabled !== undefined &&
      reminder_enabled !== 0 &&
      reminder_enabled !== 1
    ) {
      return res.status(400).json({
        message: "reminder_enabled must be 0 or 1",
      });
    }


    // ======================================
    // UPDATE
    // ======================================
    const result = await updateBirthday(
      id,
      user_id,
      person_name.trim(),
      relation.trim(),
      date_of_birth,
      phone ? String(phone).trim() : null,
      email ? String(email).trim() : null,
      notes ? notes.trim() : null,
      reminder_enabled ?? 0
    );


    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Birthday not found",
      });
    }


    res.status(200).json({
      message: "Birthday updated successfully",
      result,
    });

  } catch (error) {
    console.error("Update Birthday Error:", error);

    res.status(500).json({
      message: "Failed to update birthday",
      error: error.message,
    });
  }
};



// ==========================================
// UPDATE BIRTHDAY STATUS
// ==========================================
export const changeBirthdayStatus = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;
    const { is_active } = req.body;


    // ======================================
    // STATUS VALIDATION
    // ======================================
    if (is_active !== 0 && is_active !== 1) {
      return res.status(400).json({
        message: "is_active must be 0 or 1",
      });
    }


    // ======================================
    // UPDATE STATUS
    // ======================================
    const result = await updateBirthdayStatus(
      id,
      user_id,
      is_active
    );


    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Birthday not found",
      });
    }


    res.status(200).json({
      message:
        is_active === 1
          ? "Birthday activated successfully"
          : "Birthday deactivated successfully",
      result,
    });

  } catch (error) {
    console.error(
      "Change Birthday Status Error:",
      error
    );

    res.status(500).json({
      message: "Failed to update birthday status",
      error: error.message,
    });
  }
};



// ==========================================
// GET BIRTHDAYS FOR REMINDER
// ==========================================
export const getBirthdaysReminder = async (req, res) => {
  try {
    const birthdays = await getBirthdaysForReminder();

    res.status(200).json({
      message: "Birthdays fetched successfully",
      birthdays,
    });

  } catch (error) {
    console.error(
      "Get birthdays for reminder error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch birthdays for reminder",
      error: error.message,
    });
  }
};



// ==========================================
// GET TODAY'S BIRTHDAYS
// ==========================================
export const getTodayBirthdayReminders = async (
  req,
  res
) => {
  try {
    const birthdays = await getTodaysBirthdays();

    res.status(200).json({
      message:
        "Today's birthday reminders fetched successfully",
      birthdays,
    });

  } catch (error) {
    console.error(
      "Today's birthday reminder error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch today's birthday reminders",
      error: error.message,
    });
  }
};