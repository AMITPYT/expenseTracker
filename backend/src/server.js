import app from './config/app.js';
import connectDB from './config/db.js';
import config from './config/config.js';

connectDB()
    .then(() => {
        app.listen(config.port, () => {
            console.log(`Server running on port ${config.port}`);
            console.log(`API: http://localhost:${config.port}/api`);
        });
    });
