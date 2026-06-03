import { Todo } from "../models/todo.model.js";

export async function createTodo(req, res) {
    try {

        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Title and Description is required"
            });
        }

        const todo = await Todo.create({
            title, userId: req.user._id, description,
        });

        if (!todo) {
            return res.status(401).json({
                success: false,
                message: "Todo is not created"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Todo is created",
            data: todo
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Sever error"
        });
    }
}

export async function updateTodo(req, res) {
    try {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Id is required"
            });
        }

        const todo = await Todo.findById(id);

        if (!todo) {
            return res.status(403).json({
                success: false,
                message: "Todo not found"
            });
        }

        if (todo.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: You are not allowed to update this todo"
            });
        }

        const updateTodo = await Todo.findByIdAndUpdate(
            id, {
            $set: req.body,
        }, {
            returnDocument: "after",
            runValidators: true,
        });

        return res.status(200).json({
            success: true,
            message: "Todo update successfully",
            data: updateTodo
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}

export async function deleteTodo(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Id is required"
            });
        }

        const todo = await Todo.findById(id);

        if (!todo) {
            return res.status(403).json({
                success: false,
                message: "Todo not found"
            });
        }

        if (todo.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: You are not allowed to delete this todo"
            });
        }

        await Todo.findByIdAndDelete(id);

        return res.status(204).json({
            success: true,
            message: "Todo delete successfully",
            data: {}
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}

export async function getTodosList(req, res) {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            sortBy = "createdAt",
            order = "desc"
        } = req.query;

        const filter = {
            userId: req.user._id
        };

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [todos, total] = await Promise.all([
            Todo.find(filter)
                .sort({
                    [sortBy]: order === "asc" ? 1 : -1
                })
                .skip(skip)
                .limit(Number(limit))
                .lean(),

            Todo.countDocuments(filter)
        ]);

        return res.status(200).json({
            success: true,
            data: todos,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}