const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const autoclaveCyclesRoutes = require('./routes/autoclaveCycles');
const mediaBatchesRoutes = require('./routes/mediaBatches');
const samplingRoutes = require('./routes/sampling');
const subcultureRoutes = require('./routes/subculturing');
const incubationRoutes = require('./routes/incubation');
const qualityControlRoutes = require('./routes/cleaningRecord');
const dashboardRoutes = require('./routes/dashboard');
const operatorsRoutes = require('./routes/operators');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration for production
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://yourdomain.com'] // Replace with your production domain
  : ['http://localhost:5173', 'http://localhost:5001', 'http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/auth', usersRoutes);
app.use('/api/operators', operatorsRoutes);
app.use('/api/indoor/autoclave-cycles', autoclaveCyclesRoutes);
app.use('/api/indoor/media-batches', mediaBatchesRoutes);
app.use('/api/indoor/sampling', samplingRoutes);
app.use('/api/indoor/subculturing', subcultureRoutes);
app.use('/api/indoor/incubation', incubationRoutes);
app.use('/api/indoor/cleaning-record', qualityControlRoutes);
app.use('/api/indoor/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ERP Backend API is running', environment: process.env.NODE_ENV });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});