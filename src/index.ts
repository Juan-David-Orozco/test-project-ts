import "reflect-metadata"; // Must be imported first for tsyringe decorators
import app from "./app.js";
import { container } from './config/inversify.config.js'; // Importar el contenedor configurado
import { PrismaClient } from "@prisma/client";
import { TYPES } from './config/types.js'; // Importar los tipos/símbolos
import { PORT } from "./config/conf.js";

// Database connection and server start
const runServer = async () => {
  // Obtener la instancia de PrismaClient desde el contenedor
  const prisma = container.get<PrismaClient>(TYPES.PrismaClient);
  // const prisma = container.resolve<PrismaClient>(PRISMA_CLIENT); // Resolve PrismaClient from container
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
