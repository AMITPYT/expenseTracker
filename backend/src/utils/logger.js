const logger = {
    info: (message) => {
        console.log(`\x1b[32m[INFO]\x1b[0m ${new Date().toISOString()} - ${message}`);
    },
    
    error: (message, error = '') => {
        console.error(`\x1b[31m[ERROR]\x1b[0m ${new Date().toISOString()} - ${message}`, error);
    },
    
    warn: (message) => {
        console.warn(`\x1b[33m[WARN]\x1b[0m ${new Date().toISOString()} - ${message}`);
    },
    
    debug: (message) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`\x1b[36m[DEBUG]\x1b[0m ${new Date().toISOString()} - ${message}`);
        }
    }
};

export default logger;