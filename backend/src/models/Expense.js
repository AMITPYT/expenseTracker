import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
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
    amount: {
        type: Number,
        required: [true, 'Please provide an amount'],
        min: [0.01, 'Amount must be greater than 0']
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        trim: true,
        maxlength: [200, 'Description cannot exceed 200 characters']
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, categoryId: 1, date: -1 });

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
