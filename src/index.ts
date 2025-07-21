import app from './app.js'
import { PORT } from './config/conf.js'
import prisma from './config/prisma.js'

// Database connection and server start
const runServer = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL database');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to database or start server:', error);
    process.exit(1); // Exit process with failure
  }
}

runServer()