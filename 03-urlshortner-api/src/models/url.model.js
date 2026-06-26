import mongoose, { Schema } from "mongoose";

const urlSchema = new Schema(
    {
        shortId: {
            type: String,
            required: true,
            unique: true,
        },
        url: {
            type: String,
            required: true,
        },
        visitHistory: [
            { timeStamp: { type: Number }}
        ],
    },
    {
        timestamps: true
    }
);

export const Url = mongoose.model("Url", urlSchema);