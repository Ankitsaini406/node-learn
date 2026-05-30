import { Blog } from "../models/blog.model.js";
import { ApiError, asyncHandler, validateAllowedFields, ApiResponse } from "../utils/utils.js";

export const createBlog = asyncHandler(async (req, res) => {

    validateAllowedFields(req.body, ["title", "content", "category", "tags"]);

    const { title, content, category, tags } = req.body;

    if (!title || !content || !category, !tags) {
        throw new ApiError(400, "All fields are required");
    }

    const existBlog = await Blog.findOne({ title });

    if (existBlog) {
        throw new ApiError(409, `Blog is already created using this title: ${title}`);
    }

    const blog = Blog.create({
        title, content, category, tags
    });

    return res.status(201).json(
        new ApiResponse(201, blog, "Blog Created Successfully")
    )
});