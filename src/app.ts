import express from "express";
import morgan from 'morgan'

import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';

const app = express()

app.use(morgan("dev"))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Welcome to Server to TypeScript</h1>')
})

app.get('/api', (req, res) => {
  res.send('<h2>API build with TypeScript</h2>')
})

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

export default app