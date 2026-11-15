const express = require("express");
const cors = require("cors");
const client = require("prom-client");

const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Prometheus metrics
const register = new client.Registry();

client.collectDefaultMetrics({ register });

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "status_code"],
  registers: [register]
});

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method"],
  registers: [register]
});

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5176",
    "http://localhost:5177"
  ]
}));

app.use(express.json());

// Collect HTTP metrics
app.use((req, res, next) => {
  if (req.path === "/metrics") {
    return next();
  }

  const end = httpRequestDuration.startTimer();

  res.on("finish", () => {
    httpRequestsTotal.inc({
      method: req.method,
      status_code: res.statusCode
    });

    end({ method: req.method });
  });

  next();
});

// Prometheus endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Node.js Dockerized API is running!",
    status: "healthy"
  });
});

// API routes
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

// 404 handler
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
