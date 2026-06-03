import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema(
    {
        title: {
            type: String,
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