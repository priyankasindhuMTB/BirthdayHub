import express from "express";
import dotenv from "dotenv";
import db from "./config/db.js";
import app from "./app.js";
import { startBirthdayReminderJob } from "./cron-job/birthdayReminderJob.js";

dotenv.config();

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    const connection = await db.getConnection();

    console.log("✅ MySQL Connected Successfully");

    connection.release();

     app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      startBirthdayReminderJob();
    });

  } catch (error) {
    console.error("❌ Database Connection Failed");
    console.error(error.message);
  }
}

startServer();