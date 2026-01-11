import Expense from '../models/Expense.js';
import Category from '../models/Category.js';
import Budget from '../models/Budget.js';
import Alert from '../models/Alert.js';
import { checkBudgetAlert, checkTotalBudgetAlert } from '../utils/alertHelper.js';

export const addExpense = async (req, res) => {
    try {
        const { categoryId, amount, description, date } = req.body;

        const category = await Category.findOne({ _id: categoryId, userId: req.user.id });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        const expenseDate = date ? new Date(date) : new Date();
        const expenseMonth = expenseDate.toISOString().slice(0, 7);
        
        const budget = await Budget.findOne({ 
            userId: req.user.id, 
            categoryId: categoryId, 
            month: expenseMonth 
        });

        if (budget) {
            const startDate = new Date(expenseMonth + '-01');
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);

            const existingExpenses = await Expense.find({
                userId: req.user.id,
                categoryId: categoryId,
                date: { $gte: startDate, $lt: endDate }
            });

            const totalSpent = existingExpenses.reduce((sum, exp) => sum + exp.amount, 0);
            const currentRemaining = budget.limit - totalSpent;
            
            const newTotalSpent = totalSpent + parseFloat(amount);
            if (newTotalSpent > budget.limit) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot add expense: Adding ₹${parseFloat(amount).toFixed(2)} would exceed your budget of ₹${budget.limit.toFixed(2)}. Current spent: ₹${totalSpent.toFixed(2)}, remaining: ₹${currentRemaining.toFixed(2)}.`
                });
            }
        }

        const expense = await Expense.create({
            userId: req.user.id,
            categoryId,
            amount,
            description,
            date: expenseDate
        });

        await checkBudgetAlert(req.user.id, categoryId, expenseMonth);
        await checkTotalBudgetAlert(req.user.id, expenseMonth);

        const populatedExpense = await Expense.findById(expense._id).populate('categoryId', 'name color icon');

        res.status(201).json({
            success: true,
            message: 'Expense added successfully',
            data: populatedExpense
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getExpenses = async (req, res) => {
    try {
        const { month, categoryId } = req.query;

        const query = { userId: req.user.id };

        if (month) {
            const startDate = new Date(month + '-01');
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);

            query.date = { $gte: startDate, $lt: endDate };
        }

        if (categoryId) {
            query.categoryId = categoryId;
        }

        const expenses = await Expense.find(query)
            .populate('categoryId', 'name color icon')
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: expenses.length,
            data: expenses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        const expenseMonth = new Date(expense.date).toISOString().slice(0, 7);
        await checkBudgetAlert(req.user.id, expense.categoryId, expenseMonth);
        await checkTotalBudgetAlert(req.user.id, expenseMonth);

        res.status(200).json({
            success: true,
            message: 'Expense deleted successfully',
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getSummary = async (req, res) => {
    try {
        const { month } = req.query;
        const currentMonth = month || new Date().toISOString().slice(0, 7);

        const startDate = new Date(currentMonth + '-01');
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const expenses = await Expense.find({
            userId: req.user.id,
            date: { $gte: startDate, $lt: endDate }
        }).populate('categoryId', 'name color icon');

        const budgets = await Budget.find({
            userId: req.user.id,
            month: currentMonth
        }).populate('categoryId', 'name color icon');

        const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

        const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);

        const categoryBreakdown = {};
        expenses.forEach(exp => {
            const catId = exp.categoryId._id.toString();
            if (!categoryBreakdown[catId]) {
                categoryBreakdown[catId] = {
                    category: exp.categoryId,
                    total: 0,
                    count: 0
                };
            }
            categoryBreakdown[catId].total += exp.amount;
            categoryBreakdown[catId].count += 1;
        });

        const alerts = await Alert.find({
            userId: req.user.id,
            createdAt: { $gte: startDate }
        }).populate('categoryId', 'name color icon').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                month: currentMonth,
                totalSpent,
                totalBudget,
                remaining: totalBudget - totalSpent,
                percentage: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
                categoryBreakdown: Object.values(categoryBreakdown),
                recentExpenses: expenses.slice(0, 5),
                alerts: alerts.filter(a => !a.isRead).slice(0, 5)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ userId: req.user.id }).sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name, color, icon } = req.body;

        const category = await Category.create({
            userId: req.user.id,
            name,
            color: color || '#6366f1',
            icon: icon || '💰'
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Category with this name already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
