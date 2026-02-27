const Task = require("../models/Task");

// @desc Create new task
// @route POST /api/tasks
// @access Private
const createTask = async (req, res) => {
  const { title, description, priority, dueDate } = req.body;

  const task = await Task.create({
    title,
    description,
    priority,
    dueDate,
    createdBy: req.user._id,
  });

  res.status(201).json(task);
};

// @desc Get logged-in user's tasks (with search & filter)
// @route GET /api/tasks
// @access Private
// @desc Get logged-in user's tasks (with search, filter & pagination)
// @route GET /api/tasks
// @access Private
const getMyTasks = async (req, res) => {
  const { status, priority, keyword, page = 1, limit = 5 } = req.query;

  let filter = { createdBy: req.user._id };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  if (keyword) {
    filter.title = { $regex: keyword, $options: "i" };
  }

  const pageNumber = Number(page);
  const pageSize = Number(limit);

  const totalTasks = await Task.countDocuments(filter);

  const tasks = await Task.find(filter)
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  res.json({
    tasks,
    page: pageNumber,
    pages: Math.ceil(totalTasks / pageSize),
    total: totalTasks,
  });
};

// @desc Get single task
// @route GET /api/tasks/:id
// @access Private
const getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Only owner or admin can view
  if (
    task.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized");
  }

  res.json(task);
};

// @desc Update task
// @route PUT /api/tasks/:id
// @access Private
const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (
    task.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized");
  }

  task.title = req.body.title || task.title;
  task.description = req.body.description || task.description;
  task.status = req.body.status || task.status;
  task.priority = req.body.priority || task.priority;
  task.dueDate = req.body.dueDate || task.dueDate;

  const updatedTask = await task.save();

  res.json(updatedTask);
};

// @desc Delete task
// @route DELETE /api/tasks/:id
// @access Private
const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (
    task.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized");
  }

  await task.deleteOne();

  res.json({ message: "Task removed" });
};

// @desc Admin - Get all tasks
// @route GET /api/tasks/admin/all
// @access Private/Admin
const getAllTasks = async (req, res) => {
  const tasks = await Task.find().populate("createdBy", "name email");
  res.json(tasks);
};

// @desc Dashboard statistics
// @route GET /api/tasks/dashboard
// @access Private
const getDashboardStats = async (req, res) => {
  const matchCondition = { createdBy: req.user._id };

  const total = await Task.countDocuments(matchCondition);

  const pending = await Task.countDocuments({
    ...matchCondition,
    status: "pending",
  });

  const inProgress = await Task.countDocuments({
    ...matchCondition,
    status: "in-progress",
  });

  const completed = await Task.countDocuments({
    ...matchCondition,
    status: "completed",
  });

  const highPriority = await Task.countDocuments({
    ...matchCondition,
    priority: "high",
  });

  res.json({
    totalTasks: total,
    pending,
    inProgress,
    completed,
    highPriority,
  });
};

module.exports = {
  createTask,
  getMyTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getAllTasks,
  getDashboardStats,
};
