import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a category name'],
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    color: {
        type: String,
        default: '#6366f1'
    },
    icon: {
        type: String,
        default: '💰'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

categorySchema.index({ name: 1, userId: 1 }, { unique: true });

const Category = mongoose.model('Category', categorySchema);

export default Category;
