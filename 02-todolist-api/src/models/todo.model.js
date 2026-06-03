import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema(
    {
        title: {
            type: String,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        description: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

export const Todo = mongoose.model("Todo", todoSchema);