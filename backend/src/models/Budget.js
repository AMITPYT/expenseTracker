import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    limit: {
        type: Number,
        required: [true, 'Please provide a budget limit'],
        min: [0, 'Budget limit cannot be negative']
    },
    month: {
        type: String,
        required: true,
        match: [/^\d{4}-(0[1-9]|1[0-2])$/, 'Month must be in YYYY-MM format']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

budgetSchema.index({ userId: 1, categoryId: 1, month: 1 }, { unique: true });

budgetSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;
