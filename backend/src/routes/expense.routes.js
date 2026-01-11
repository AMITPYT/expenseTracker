import express from 'express';
import {
    addExpense,
    getExpenses,
    deleteExpense,
    getSummary,
    getCategories,
    createCategory
} from '../controllers/expense.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/summary', getSummary);
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.route('/').post(addExpense).get(getExpenses);
router.route('/:id').delete(deleteExpense);

export default router;
