import express from 'express';
import {
    setBudget,
    getBudgets,
    updateBudget,
    deleteBudget
} from '../controllers/budget.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/').post(setBudget).get(getBudgets);
router.route('/:id').put(updateBudget).delete(deleteBudget);

export default router;
