import mongoose, { Schema } from "mongoose";

const urlSchema = new Schema(
    {
        shortId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        url: {
            type: String,
            required: true,
            trim: true,
        },

        totalClicks: {
            type: Number,
            default: 0,
        },

        visitHistory: [
            {
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Url = mongoose.model("Url", urlSchema);