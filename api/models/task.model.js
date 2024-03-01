import mongoose from "mongoose";
const { Schema } = mongoose; // Import Schema from mongoose

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    due_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "DONE"],
      required: true,
      default: "TODO",
    },
    priority: {
      type: Number,
      enum: [0, 1, 2, 3],
      // 0 - Due date is today
      // 1 - Due date is between tomorrow and day after tomorrow // 1-2
      // 2 - 3-4
      // 3 - 5+
      required: true,
    },
    // soft delete
    isDeleted: {
      type: Boolean,
      default: false,
    },
    // fk reference of user who has created this task
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deleted_at: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
