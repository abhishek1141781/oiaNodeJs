import cron from "node-cron";
import Task from "../models/task.model.js";
import { setTaskPriority } from "../utils/priority.js";

export const dailyPriorityUpdateBasedOnDueDate = (next) => {
//   console.log("node cron entered");
  // Run every day at midnight (00:00) in IST timezone
  cron.schedule(
    "* * * * *",
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
