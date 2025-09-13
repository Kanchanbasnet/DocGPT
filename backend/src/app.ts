import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/mongodb.connection.ts';
import userRoutes from './routes/user.routes.ts';
import dataSourceRoutes from './routes/dataSource.routes.ts';
import publicRoutes from './public.routes.ts';


const app = express();
connectDB();

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/dataSource', dataSourceRoutes);
app.use('/', publicRoutes);



export default app;
