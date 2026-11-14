// Validate Create Task
const validateCreateTask = (req, res, next) => {
  const { title, description, priority } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "Task title is required and must be a non-empty string"
    });
  }

  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({
      success: false,
      message: "Description must be a string"
    });
  }

  if (
    priority !== undefined &&
    !["Low", "Medium", "High"].includes(priority)
  ) {
    return res.status(400).json({
      success: false,
      message: "Priority must be Low, Medium, or High"
    });
  }

  next();
};


// Validate Update Task
const validateUpdateTask = (req, res, next) => {
  const { title, description, priority, completed } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "A valid task title is required"
    });
  }

  if (typeof completed !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "Completed must be a boolean value"
    });
  }

  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({
      success: false,
      message: "Description must be a string"
    });
  }

  if (
    priority !== undefined &&
    !["Low", "Medium", "High"].includes(priority)
  ) {
    return res.status(400).json({
      success: false,
      message: "Priority must be Low, Medium, or High"
    });
  }

  next();
};


module.exports = {
  validateCreateTask,
  validateUpdateTask
};
