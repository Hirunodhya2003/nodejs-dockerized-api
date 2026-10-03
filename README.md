# 🐳 Node.js Dockerized REST API

A simple and portable REST API built with **Node.js and Express**, containerized using **Docker** for consistent and reliable application deployment across different environments.

## 📌 Project Overview

This project demonstrates how to package a Node.js application into a Docker container.

The application provides a simple Task Management REST API and can be built, deployed, and executed using Docker without requiring Node.js to be installed directly on the host system.

## 🎯 Project Objective

The main objective is to demonstrate **application containerization** using Docker.

This project covers:

* Building a Node.js REST API
* Creating a Dockerfile
* Building a Docker image
* Running the application inside a Docker container
* Mapping container ports to the host machine
* Testing REST API endpoints
* Preparing the application for portable deployment

## 🛠️ Technologies Used

* **Node.js**
* **Express.js**
* **Docker**
* **JavaScript**
* **REST API**
* **Git & GitHub**

## 📂 Project Structure

```text
nodejs-dockerized-api/
│
├── src/
│   └── server.js
│
├── .dockerignore
├── .gitignore
├── Dockerfile
├── package.json
├── package-lock.json
└── README.md
```

## 🐳 Dockerfile

The application uses a lightweight Node.js Alpine image.

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY src ./src

EXPOSE 3000

CMD ["node", "src/server.js"]
```

## 🚀 Run the Application Without Docker

Install dependencies:

```bash
npm install
```

Start the application:

```bash
node src/server.js
```

The API will be available at:

```text
http://localhost:3000
```

## 🐳 Build the Docker Image

Build the Docker image using:

```bash
docker build -t nodejs-dockerized-api .
```

Verify the image:

```bash
docker images
```

## ▶️ Run the Docker Container

Run the application as a container:

```bash
docker run -d --name nodejs-api -p 3000:3000 nodejs-dockerized-api
```

Check the running container:

```bash
docker ps
```

## 🔌 API Endpoints

| Method | Endpoint         | Description              |
| ------ | ---------------- | ------------------------ |
| GET    | `/`              | Check application status |
| GET    | `/api/tasks`     | Get all tasks            |
| POST   | `/api/tasks`     | Create a new task        |
| DELETE | `/api/tasks/:id` | Delete a task            |

## 🧪 API Testing

### Check Application Status

```bash
curl http://localhost:3000
```

### Get All Tasks

```bash
curl http://localhost:3000/api/tasks
```

### Create a Task

```bash
curl -X POST http://localhost:3000/api/tasks \
-H "Content-Type: application/json" \
-d '{"title":"Learn Docker Containerization"}'
```

### Delete a Task

```bash
curl -X DELETE http://localhost:3000/api/tasks/1
```

## 🏗️ Architecture

```text
                Node.js Application
                         │
                         ▼
                    Dockerfile
                         │
                         ▼
                  Docker Image
                         │
                         ▼
                 Docker Container
                         │
                         ▼
                   Port 3000
                         │
                         ▼
                    REST API
```

## 🔍 Docker Container Verification

View running containers:

```bash
docker ps
```

View application logs:

```bash
docker logs nodejs-api
```

Stop the container:

```bash
docker stop nodejs-api
```

Remove the container:

```bash
docker rm nodejs-api
```

## 📚 Key Docker Concepts Demonstrated

* Docker Images
* Docker Containers
* Dockerfile
* Docker Build
* Port Mapping
* Container Logs
* `.dockerignore`
* Containerized Application Deployment

## 🔗 Project Repository

GitHub:

https://github.com/Hirunodhya2003/nodejs-dockerized-api

## 👨‍💻 Author

**Hirunodhya**

Cloud & DevOps Enthusiast | AWS | Docker | Terraform | CI/CD
