import { Blog } from "../models/blog.model.js";
import slugify from "slugify";
import { ApiError, asyncHandler, validateAllowedFields, ApiResponse, generateCacheKey, setCache, getCache, delCache } from "../utils/utils.js";

export const createBlog = asyncHandler(async (req, res) => {

    validateAllowedFields(req.body, ["title", "content", "category", "tags"]);

    const { title, content, category, tags } = req.body;

    if (!title || !content || !category || !tags) {
        throw new ApiError(400, "All fields are required");
    }

    const existBlog = await Blog.findOne({ title });

    if (existBlog) {
        throw new ApiError(409, `Blog is already created using this title: ${title}`);
    }

    const blog = await Blog.create({
        title, content, category, tags
    });

    return res.status(201).json(
        new ApiResponse(201, blog, "Blog Created Successfully")
    );
});

export const updateBlog = asyncHandler(async (req, res) => {

    validateAllowedFields(req.body, ["title", "content", "category", "tags"]);

    const { id } = req.params;

    const updatedData = { ...req.body };

    if (updatedData.title) {
        updatedData.slug = slugify(updatedData.title, {
            lower: true,
            strict: true,
            trim: true,
        });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
        id, {
        $set: updatedData,
    },
        {
            returnDocument: "after",
            runValidators: true,
        }
    );

    if (!updateBlog) {
        throw new ApiError(404, "Blog not found");
    }

    const listCacheKey = id;
    await delCache(listCacheKey);

    return res.status(200).json(
        new ApiResponse(200, "Blog update successfully")
    );
});

export const deleteBlog = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
        throw new ApiError(404, "Blog not found");
    }

    const listCacheKey = id;
    await delCache(listCacheKey);

    return res.status(204).json(
        new ApiResponse(204, null, "No Content")
    );
});

export const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const key = generateCacheKey(req);
    const cacheData = await getCache(key);

    if (cacheData) {
        return res.status(200).json(
            new ApiResponse(200, cacheData, "Blog is get from cache")
        );
    }

    const blog = await Blog.findById(id);

    if (!blog) {
        throw new ApiError(404, "BLog not found");
    }

    await setCache(key, blog, 120);

    return res.status(200).json(
        new ApiResponse(200, blog, "Blog fetched successfully")
    );
});

export const getAllBlog = asyncHandler(async (req, res) => {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, blogs, "All Blogs fetched successfully")
    );
});

export const searchBlog = asyncHandler(async (req, res) => {
    const { term } = req.query;

    if (!term) {
        throw new ApiError(400, "Search term is required");
    }
    
    const key = generateCacheKey(req);
    const cacheData = await getCache(key);

    if (cacheData) {
        return res.status(200).json(
            new ApiResponse(200, cacheData, "Search is get from cache")
        );
    }

    const blogs = await Blog.find({
        $or: [
            { title: { $regex: term, $options: "i" } },
            { content: { $regex: term, $options: "i" } },
            { category: { $regex: term, $options: "i" } },
            { tags: { $in: [new RegExp(term, "i")] } },
        ],
    });

    await setCache(key, blogs, 120);

    return res.status(200).json(
        new ApiResponse(200, blogs, "Search results")
    );
});