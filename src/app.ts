import express from "express";
import morgan from 'morgan'

import mainRouter from './routes/index.js'; // Import the main router

const app = express()

// Middlewares
app.use(morgan("dev"))
app.use(express.json())

// Basic routes
app.get('/', (req, res) => {
  res.send('<h1>Welcome to Server to TypeScript</h1>')
})
app.get('/api', (req, res) => {
  res.send('<h2>API build with TypeScript</h2>')
})

// Routes
app.use('/api', mainRouter)

export default app