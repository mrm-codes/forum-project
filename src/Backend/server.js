// Load environment variables as early as possible
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('./config/db');
const categoryRoute = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const threadRoutes = require('./routes/threadRoutes');
const postRoutes = require('./routes/postRoutes');

const PORT = process.env.PORT || 3006;

const app = express();

// Middleware configuration
function configureMiddleware(app) {
  // Security headers
  app.use(helmet());

  // CORS configuration
  const allowedOrigins = ['https://mrm-codes.github.io', 'https://mrm-codes.github.io/forum-project/'];

  const corsOptions = {
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Authorization', 'Content-Type'],
      credentials: true,
    }; 
  app.use(cors(corsOptions));

  // Body parsing middleware
  app.use(express.json());
  }

// Apply middleware
configureMiddleware(app);

// Route configuration
app.use('/api', categoryRoute);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', threadRoutes);
app.use('/api', postRoutes);

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
 res.status(500).json({ error: 'Something went wrong, please try again.' });
  });

// Connect to database and start the server
async function startServer() {
  try {
    await sequelize.sync(); // Ensuring DB connection and models sync
    console.log('Database connected');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1); // Exit process if DB connection fails
  }
}

startServer();
