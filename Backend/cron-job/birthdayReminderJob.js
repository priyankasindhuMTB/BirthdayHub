import cron from "node-cron";
import { getTodaysBirthdays } from "../models/birthdayModel.js";
import { createNotification } from "../models/notificationModel.js";

export const startBirthdayReminderJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      console.log("🔔 Checking today's birthdays...");

      const birthdays = await getTodaysBirthdays();

      if (birthdays.length === 0) {
        console.log("🎂 No birthdays today");
        return;
      }

      console.log("🎉 Today's birthdays:");

      for (const birthday of birthdays) {
        console.log(
          `🎂 ${birthday.person_name} - ${
            birthday.email || "No email"
          }`
        );

        const notification = await createNotification(
          birthday.user_id,
          birthday.id,
          "Birthday Today 🎂",
          `Today is ${birthday.person_name}'s birthday!`
        );

        if (notification.alreadyExists) {
          console.log(
            `ℹ️ Notification already exists today for ${birthday.person_name}`
          );
        } else {
          console.log(
            `🔔 Notification created for ${birthday.person_name}`
          );
        }
      }
    } catch (error) {
      console.error("❌ Birthday reminder job error:", error);
    }
  });

  console.log("⏰ Birthday reminder job started");
};