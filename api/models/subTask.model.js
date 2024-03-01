import mongoose from "mongoose";

const { Schema } = mongoose;

const subTaskSchema = new mongoose.Schema(
  {
    status: {
      type: Number,
      enum: [0, 1], // 0-incomplete, 1-completed
      default: 0,
      required: true,
    },

    // soft delete
    isDeleted: {
      type: Boolean,
      default: false,
    },

    // fk reference of task whose subtask it is
    task_id: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    deleted_at: {
      type: Date,
    },
  },
  { timestamps: true }
);

const SubTask = mongoose.model("SubTask", subTaskSchema);

export default SubTask;
