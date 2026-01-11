import express from 'express';
import cors from 'cors';
import errorHandler from '../middleware/errorHandler.js';
import routes from './routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is running'
    });
});

app.use(errorHandler);
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

export default app; 