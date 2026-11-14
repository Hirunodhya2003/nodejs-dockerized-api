const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

const {
  validateCreateTask,
  validateUpdateTask
} = require("../validators/taskValidator");

// Protect all task routes
router.use(authenticateToken);

// GET all tasks
router.get("/", getAllTasks);

// GET task by ID
router.get("/:id", getTaskById);

// CREATE task with validation
router.post("/", validateCreateTask, createTask);

// UPDATE task with validation
router.put("/:id", validateUpdateTask, updateTask);

// DELETE task
router.delete("/:id", deleteTask);

module.exports = router;
