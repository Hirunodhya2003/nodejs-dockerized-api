const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const tasks = [
  {
    id: 1,
    title: "Learn Docker",
    completed: false
  },
  {
    id: 2,
    title: "Build a container",
    completed: true
  }
];

app.get("/", (req, res) => {
  res.json({
    message: "Node.js Dockerized API is running!",
    status: "success"
  });
});

app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const newTask = {
    id: tasks.length + 1,
    title: req.body.title,
    completed: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = tasks.findIndex(task => task.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  const deletedTask = tasks.splice(index, 1);

  res.json({
    message: "Task deleted successfully",
    task: deletedTask[0]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
