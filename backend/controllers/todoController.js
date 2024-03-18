import asyncHandler from "express-async-handler";
import Todo from "../models/todoModel.js";

// @desc    Get all todos
// @route   GET /api/v1/todos
// @access  Private
export const getTodos = asyncHandler(async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new todo
// @route   POST /api/v1/todos
// @access  Private
export const createTodo = asyncHandler(async (req, res) => {
  const todoData = req.body;
  todoData.user = req.user._id;
  const todo = new Todo(todoData);
  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a todo
// @route   PUT /api/v1/todos/:id
// @access  Private
export const updateTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await Todo.findById(id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    todo.title = req.body.title;
    const updatedTodo = await todo.save();
    res.status(201).json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Toggle a todo
// @route   PATCH /api/v1/todos/:id
// @access  Private
export const toggleTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await Todo.findById(id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    todo.title = req.body.title;
    todo.completed = !todo.completed;
    const updatedTodo = await todo.save();
    res.status(201).json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a todo
// @route   DELETE /api/v1/todos/:id
// @access  Private
export const deleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);
    res.status(201).json(deletedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
