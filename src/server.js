import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import taskRoutes from './routes/tasks.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

const PORT = process.env.PORT || 5000;

import pageRoutes from './routes/pages.js';
import dashboardRoutes from './routes/dashboard.js';
import channelRoutes from './routes/channels.js';
import notificationRoutes from './routes/notifications.js';
import projectRoutes from './routes/projects.js';
import metricDashboardRoutes from './routes/metricDashboards.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import { seedMetricDashboards } from './seedDashboards.js';

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/metric-dashboards', metricDashboardRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Lattice Backend' });
});

seedMetricDashboards();

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});