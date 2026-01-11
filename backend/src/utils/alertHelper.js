import Budget from '../models/Budget.js';
import Category from '../models/Category.js';
import Expense from '../models/Expense.js';
import Alert from '../models/Alert.js';

export const checkBudgetAlert = async (userId, categoryId, month) => {
    try {
        const budget = await Budget.findOne({ userId, categoryId, month });

        const startDate = new Date(month + '-01');
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);


        if (!budget) {
            await Alert.deleteMany({
                userId,
                categoryId,
                createdAt: { $gte: startDate, $lt: endDate }
            });
            return;
        }

        const expenses = await Expense.find({
            userId,
            categoryId,
            date: { $gte: startDate, $lt: endDate }
        });

        const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const remaining = budget.limit - totalSpent;
        const percentage = (totalSpent / budget.limit) * 100;

        const category = await Category.findById(categoryId);


        await Alert.deleteMany({
            userId,
            categoryId,
            createdAt: { $gte: startDate, $lt: endDate }
        });


        if (remaining < 0) {
            await Alert.create({
                userId,
                categoryId,
                message: `You've exceeded your ${category.name} budget by ₹${Math.abs(remaining).toLocaleString()}!`,
                type: 'danger',
                percentage
            });
        }

        else if (percentage >= 90) {
            await Alert.create({
                userId,
                categoryId,
                message: `Warning: Only ₹${remaining.toLocaleString()} left in your ${category.name} budget!`,
                type: 'warning',
                percentage
            });
        }


    } catch (error) {
        console.error('Error checking budget alert:', error);
    }
};

export const checkTotalBudgetAlert = async (userId, month) => {
    try {
        const startDate = new Date(month + '-01');
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);


        const budgets = await Budget.find({ userId, month });


        await Alert.deleteMany({
            userId,
            categoryId: null,
            createdAt: { $gte: startDate, $lt: endDate }
        });

        if (budgets.length === 0) return;

        const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);


        const expenses = await Expense.find({
            userId,
            date: { $gte: startDate, $lt: endDate }
        });

        const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
        const totalRemaining = totalLimit - totalSpent;
        const totalPercentage = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;




        if (totalRemaining < 0) {
            await Alert.create({
                userId,
                categoryId: null,
                message: `CRITICAL: You've exceeded your TOTAL budget by ₹${Math.abs(totalRemaining).toLocaleString()}!`,
                type: 'danger',
                percentage: totalPercentage
            });
        }

        else if (totalPercentage >= 90) {
            await Alert.create({
                userId,
                categoryId: null,
                message: `Heads up! Total budget is running low. Only ₹${totalRemaining.toLocaleString()} remaining.`,
                type: 'warning',
                percentage: totalPercentage
            });
        }

    } catch (error) {
        console.error('Error checking total budget alert:', error);
    }
};
