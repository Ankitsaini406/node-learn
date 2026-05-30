import { Router } from "express";
import { createBlog, deleteBlog, getAllBlog, getBlog, searchBlog, updateBlog } from "../controller/blog.controller.js";

const router = Router();

router.route("/")
    .post(createBlog)
    .get(getAllBlog);

router.get("/search", searchBlog);

router.route("/:id")
    .get(getBlog)
    .put(updateBlog)
    .delete(deleteBlog);

export default router;