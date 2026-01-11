import express from 'express';
import authRoutes from '../routes/auth.routes.js';
import budgetRoutes from '../routes/budget.routes.js';
import expenseRoutes from '../routes/expense.routes.js';

const router = express.Router();


router.use('/auth', authRoutes);
router.use('/budgets', budgetRoutes);
router.use('/expenses', expenseRoutes);

export default router;