import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

const blogSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        slug: {
            type: String,
            unique: true,
            index: true,
        },
        content: {
            type: String,
        },
        category: {
            type: String,
        },
        tags: {
            type: [String],
            default: [],
        }
    },
    {
        timestamps: true,
    }
);

blogSchema.pre("save", function (next) {
    if (!this.isModified("title")) {
        return next();
    }

    this.slug = slugify(this.title, {
        lower: true,
        strict: true,
        trim: true,
    });
    next();
});

export const Blog = mongoose.model("Blog", blogSchema);
