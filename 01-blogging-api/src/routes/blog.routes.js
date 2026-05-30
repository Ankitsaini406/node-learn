import { Router } from "express";
import { createBlog, deleteBlog, getBlog, updateBlog } from "../controller/blog.controller.js";

const router = Router();

router.route("/create").post(createBlog);

router.put("/update/:id", updateBlog);

router.delete("/delete/:id", deleteBlog);

router.get("/:id", getBlog);

export default router;