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