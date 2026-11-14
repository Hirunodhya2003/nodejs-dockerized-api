const pool = require("../config/database");

// GET all tasks belonging to logged-in user
const getAllTasks = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1 ORDER BY id ASC",
      [userId]
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

// GET task by ID belonging to logged-in user
const getTaskById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user.userId;

    const result = await pool.query(
      "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// CREATE task for logged-in user
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority } = req.body;
    const userId = req.user.userId;

    const result = await pool.query(
      `INSERT INTO tasks (title, description, priority, user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, description || "", priority || "Medium", userId]
    );

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE task belonging to logged-in user
const updateTask = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user.userId;
    const { title, description, priority, completed } = req.body;

    const result = await pool.query(
      `UPDATE tasks
       SET title = $1,
           description = $2,
           priority = $3,
           completed = $4
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [title, description || "", priority || "Medium", completed, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// DELETE task belonging to logged-in user
const deleteTask = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user.userId;

    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
