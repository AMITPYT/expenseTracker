// Error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Default error
    let message = 'Something went wrong!';
    let statusCode = 500;

    // Handle specific error types
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        message = 'Resource not found';
        statusCode = 404;
    }

    if (err.code === 11000) {
        message = 'Duplicate field value entered';
        statusCode = 400;
    }

    if (err.name === 'ValidationError') {
        message = Object.values(err.errors).map(val => val.message).join(', ');
        statusCode = 400;
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
};

export default errorHandler;