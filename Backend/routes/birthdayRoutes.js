import express from "express";
import { addBirthday, changeBirthdayStatus, editBirthday, getAllBirthday, getBirthdaysReminder, getTodayBirthdayReminders, } from "../controllers/birthdayController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add Birthday

router.post("/create-birthday", authenticateToken, addBirthday);
router.get("/get-all-birthday", authenticateToken, getAllBirthday);
router.put("/update-birthday/:id",authenticateToken,editBirthday);
router.patch("/update-status/:id",authenticateToken,changeBirthdayStatus);
router.get("/reminder-birthdays", getBirthdaysReminder);
router.get(
  "/today-reminders",
  authenticateToken,
  getTodayBirthdayReminders
);
export default router;