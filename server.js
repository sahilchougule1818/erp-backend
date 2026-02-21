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
const deepCleaningRoutes = require('./routes/deepCleaningRecord');
const mortalityRoutes = require('./routes/mortalityRecord');
const dashboardRoutes = require('./routes/dashboard');
const operatorsRoutes = require('./routes/operators');
const outdoorRoutes = require('./routes/outdoor');
const batchRoutes = require('./routes/batches');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration for production
app.use(cors({
  origin: '*',
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
app.use('/api/indoor/deep-cleaning-record', deepCleaningRoutes);
app.use('/api/indoor/mortality-record', mortalityRoutes);
app.use('/api/indoor/dashboard', dashboardRoutes);
app.use('/api/outdoor', outdoorRoutes);
app.use('/api/batches', batchRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ERP Backend API is running', environment: process.env.NODE_ENV });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});