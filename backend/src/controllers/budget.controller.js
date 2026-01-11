import Budget from '../models/Budget.js';
import Category from '../models/Category.js';
import Expense from '../models/Expense.js';
import Alert from '../models/Alert.js';
import { checkBudgetAlert, checkTotalBudgetAlert } from '../utils/alertHelper.js';


export const setBudget = async (req, res) => {
    try {
        const { categoryId, limit, month } = req.body;


        const category = await Category.findOne({ _id: categoryId, userId: req.user.id });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }


        const existingBudget = await Budget.findOne({
            userId: req.user.id,
            categoryId,
            month
        });

        if (existingBudget) {

            existingBudget.limit = limit;
            await existingBudget.save();


            await checkBudgetAlert(req.user.id, categoryId, month);
            await checkTotalBudgetAlert(req.user.id, month);

            return res.status(200).json({
                success: true,
                message: 'Budget updated successfully',
                data: existingBudget
            });
        }


        const budget = await Budget.create({
            userId: req.user.id,
            categoryId,
            limit,
            month
        });


        await checkBudgetAlert(req.user.id, categoryId, month);
        await checkTotalBudgetAlert(req.user.id, month);

        res.status(201).json({
            success: true,
            message: 'Budget created successfully',
            data: budget
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const getBudgets = async (req, res) => {
    try {
        const { month } = req.query;


        const currentMonth = month || new Date().toISOString().slice(0, 7);

        const budgets = await Budget.find({
            userId: req.user.id,
            month: currentMonth
        }).populate('categoryId', 'name color icon');


        const budgetsWithSpent = await Promise.all(
            budgets.map(async (budget) => {
                const startDate = new Date(currentMonth + '-01');
                const endDate = new Date(startDate);
                endDate.setMonth(endDate.getMonth() + 1);

                const expenses = await Expense.find({
                    userId: req.user.id,
                    categoryId: budget.categoryId._id,
                    date: { $gte: startDate, $lt: endDate }
                });

                const spent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
                const remaining = budget.limit - spent;
                const percentage = (spent / budget.limit) * 100;

                return {
                    ...budget.toObject(),
                    spent,
                    remaining,
                    percentage: Math.round(percentage * 10) / 10
                };
            })
        );

        res.status(200).json({
            success: true,
            count: budgetsWithSpent.length,
            data: budgetsWithSpent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const updateBudget = async (req, res) => {
    try {
        const { limit } = req.body;

        let budget = await Budget.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: 'Budget not found'
            });
        }

        budget.limit = limit || budget.limit;
        await budget.save();


        await checkBudgetAlert(req.user.id, budget.categoryId, budget.month);
        await checkTotalBudgetAlert(req.user.id, budget.month);

        res.status(200).json({
            success: true,
            message: 'Budget updated successfully',
            data: budget
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: 'Budget not found'
            });
        }


        await Budget.findByIdAndDelete(req.params.id);


        await checkBudgetAlert(req.user.id, budget.categoryId, budget.month);
        await checkTotalBudgetAlert(req.user.id, budget.month);

        res.status(200).json({
            success: true,
            message: 'Budget deleted successfully',
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
