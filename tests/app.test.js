const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
const pool = require("../src/config/database");

const token = jwt.sign(
  { userId: 1 },
  process.env.JWT_SECRET
);

const authRequest = (method, url) => {
  return request(app)[method](url)
    .set("Authorization", `Bearer ${token}`);
};

describe("API Health Check", () => {
  test("GET / should return healthy status", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe("healthy");
  });
});

describe("Task API", () => {
  let createdTaskId;

  test("GET /api/tasks should return all tasks", async () => {
    const response = await authRequest("get", "/api/tasks");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test("POST /api/tasks should create a new task", async () => {
    const response = await authRequest("post", "/api/tasks")
      .send({ title: "Automated Test Task" });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe("Automated Test Task");

    createdTaskId = response.body.data.id;
  });

  test("GET /api/tasks/:id should return a task", async () => {
    const response = await authRequest(
      "get",
      `/api/tasks/${createdTaskId}`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.data.id).toBe(createdTaskId);
  });

  test("PUT /api/tasks/:id should update a task", async () => {
    const response = await authRequest(
      "put",
      `/api/tasks/${createdTaskId}`
    ).send({
      title: "Updated Test Task",
      completed: true
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.title).toBe("Updated Test Task");
    expect(response.body.data.completed).toBe(true);
  });

  test("DELETE /api/tasks/:id should delete a task", async () => {
    const response = await authRequest(
      "delete",
      `/api/tasks/${createdTaskId}`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test("POST /api/tasks should reject an invalid title", async () => {
    const response = await authRequest("post", "/api/tasks")
      .send({ title: "" });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test("PUT /api/tasks/:id should reject invalid completed value", async () => {
    const response = await authRequest("put", "/api/tasks/1")
      .send({
        title: "Test Task",
        completed: "yes"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test("GET unknown route should return 404", async () => {
    const response = await request(app).get("/unknown-route");

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
  });
});

afterAll(async () => {
  await pool.end();
});
