import "reflect-metadata"; // Must be imported first for tsyringe decorators
import express from "express";
import morgan from "morgan";
// import app from "./app.js";
// import prisma from "./config/prisma.js";
import { container } from "tsyringe"; // Import container
import { PrismaClient } from "@prisma/client";
import { registerDependencies } from "./config/container.js"; // Import DI setup
import { PRISMA_CLIENT } from "./config/tokens.js";
import { PORT } from "./config/conf.js";
// import authRoutes from './routes/auth.routes.js';
// import projectRoutes from './routes/project.routes.js';
import mainRouter from "./routes/index.js"; // Import the main router

const app = express();

// Register all dependencies in the container FIRST.
// This ensures that all tokens are bound to their concrete implementations.
registerDependencies();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());

// Basic routes
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Server to TypeScript</h1>");
});

app.get("/api", (req, res) => {
  res.send("<h2>API build with TypeScript</h2>");
});

// app.use('/api/auth', authRoutes);
// app.use('/api/projects', projectRoutes);

// Use the main router for all API endpoints (AFTER the container has been fully registered)
// This prevents controllers (which are resolved by tsyringe) from being
// instantiated before their dependencies are known to the container.
app.use("/api", mainRouter);

// Database connection and server start
const runServer = async () => {
  const prisma = container.resolve<PrismaClient>(PRISMA_CLIENT); // Resolve PrismaClient from container
  try {
    await prisma.$connect();
    console.log("Connected to PostgreSQL database");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to database or start server:", error);
    process.exit(1); // Exit process with failure
  }
};

runServer();
