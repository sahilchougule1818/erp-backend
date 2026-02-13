const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const autoclaveCyclesRoutes = require('./routes/autoclaveCycles');
const mediaBatchesRoutes = require('./routes/mediaBatches');
const samplingRoutes = require('./routes/sampling');
const subcultureRoutes = require('./routes/subculturing');
const incubationRoutes = require('./routes/incubation');
const qualityControlRoutes = require('./routes/qualityControl');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/indoor/autoclave-cycles', autoclaveCyclesRoutes);
app.use('/api/indoor/media-batches', mediaBatchesRoutes);
app.use('/api/indoor/sampling', samplingRoutes);
app.use('/api/indoor/subculturing', subcultureRoutes);
app.use('/api/indoor/incubation', incubationRoutes);
app.use('/api/indoor/quality-control', qualityControlRoutes);
app.use('/api/indoor/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ERP Backend API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});