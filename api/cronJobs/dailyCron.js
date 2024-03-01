import cron from "node-cron";
import Task from "../models/task.model.js";
import { setTaskPriority } from "../utils/priority.js";
import User from "../models/user.model.js";
import { initiateTwilioCall } from "../utils/twilio.js";

export const dailyPriorityUpdateBasedOnDueDate = (next) => {
  //   console.log("node cron entered");
  // Run every day at midnight (00:00) in IST timezone
  // use 0 0 * * * for running at 00:00
  // cron.schedule("*/10 * * * * *",
  cron.schedule("0 0 * * *",
    async () => {
      // console.log("cron job started 1");
      try {
        // console.log("cron job started 2");
        // Update priorities based on due dates

        // Get all tasks from the database
        const tasks = await Task.find();

        // Iterate over each task to update its priority based on due date
        for (const task of tasks) {
          // Calculate the updated priority based on the task's due date
          const updatedPriority = setTaskPriority(task.due_date);
          //   console.log(task);

          // Set the updated priority to the task object
          task.priority = updatedPriority;

          // Save the updated task to the database
          await task.save();
        }
        console.log("cron job started 3");
      } catch (error) {
        // Pass any errors to the next middleware
        next(error);
      }
    },
    {
      timezone: "Asia/Kolkata", // Set timezone to IST
    }
  );
};




// DAILY RUN CHECK FOR DUE DATE PASSED

// Function to start the cron job for voice calling
export const startVoiceCallCron = (next) => {
  // Run the cron job every 10 secs
  // cron.schedule("*/10 * * * * *", async () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("Checking for overdue tasks...");

      // Query overdue tasks from the database
      const overdueTasks = await Task.find({ due_date: { $lt: new Date() } });

      // Sort overdue tasks based on user priority (ascending order)
      overdueTasks.sort((taskA, taskB) => {
        const priorityA = taskA.createdBy.priority;
        const priorityB = taskB.createdBy.priority;
        return priorityA - priorityB;
      });

      // console.log("overdueTasks :>> ", overdueTasks);

      // Iterate over the sorted overdue tasks
      for (const task of overdueTasks) {
        // Retrieve the associated user's phone number
        const user = await User.findById(task.createdBy);
        let phoneNumber = user.phone_number;

        // console.log(typeof phoneNumber);

        // convert phone no to string, add +91
        phoneNumber = String(phoneNumber);
        // Add +91 country code to the phone number if it's not already included
        const formattedPhoneNumber = phoneNumber.startsWith("+")
          ? phoneNumber
          : `+91${phoneNumber}`;

        // convert back into number and move ahead
        phoneNumber = Number(formattedPhoneNumber);


        // console.log("here 0");

        // Initiate a call using Twilio
        const callStatus = await initiateTwilioCall(phoneNumber);

        // If call is not attended, log and move to the next task
        if (!callStatus.success) {
          console.log(`Call to user ${phoneNumber} was not attended.`);
        } else {
          // Call attended, break the loop
          console.log(`Call to user ${phoneNumber} was attended.`);
          break;
        }
      }
    } catch (error) {
      console.error("Error occurred during voice call cron job:", error);
      next(error);
    }
  });
};
