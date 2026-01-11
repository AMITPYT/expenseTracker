import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['warning', 'danger', 'info'],
        default: 'warning'
    },
    percentage: {
        type: Number,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

alertSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;
