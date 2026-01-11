import { useState, useEffect } from 'react';
import api from '../services/api';
import './Expenses.css';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        categoryId: '',
        amount: '',
        description: '',
        date: new Date().toISOString().slice(0, 10),
    });
    const [filter, setFilter] = useState({
        month: new Date().toISOString().slice(0, 7),
        categoryId: '',
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchExpenses();
    }, [filter]);

    useEffect(() => {
        if (showForm) {
            const month = formData.date.slice(0, 7);
            fetchBudgets(month);
        }
    }, [showForm, formData.date]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/expenses/categories');
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filter.month) params.append('month', filter.month);
            if (filter.categoryId) params.append('categoryId', filter.categoryId);

            const response = await api.get(`/expenses?${params}`);
            setExpenses(response.data.data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBudgets = async (month) => {
        try {
            const response = await api.get(`/budgets?month=${month}`);
            setBudgets(response.data.data);
        } catch (error) {
            console.error('Error fetching budgets:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const budgetStatus = getBudgetStatus();
        if (budgetStatus && budgetStatus.willExceed) {
            alert(`Cannot add expense: ${budgetStatus.isOverBudget 
                ? `Budget is already exceeded by ₹${Math.abs(budgetStatus.remaining).toFixed(2)}` 
                : `Amount exceeds remaining budget of ₹${budgetStatus.remaining.toFixed(2)}`}`);
            return;
        }

        try {
            await api.post('/expenses', formData);
            setFormData({
                categoryId: '',
                amount: '',
                description: '',
                date: new Date().toISOString().slice(0, 10),
            });
            setShowForm(false);
            fetchExpenses();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to add expense';
            alert(errorMessage);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this expense?')) return;

        try {
            await api.delete(`/expenses/${id}`);
            fetchExpenses();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete expense');
        }
    };



    const getBudgetStatus = () => {
        if (!formData.categoryId) return null;
        const budget = budgets.find(b => b.categoryId._id === formData.categoryId);
        if (!budget) return null;

        const amount = parseFloat(formData.amount) || 0;
        const remaining = budget.remaining;
        const isOverBudget = budget.spent > budget.limit;
        const willExceed = amount > 0 && (amount > remaining || isOverBudget || remaining < 0);

        return { remaining, willExceed, isOverBudget, limit: budget.limit };
    };

    const budgetInfo = getBudgetStatus();

    const isExceedingBudget = budgetInfo && budgetInfo.willExceed;

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    return (
        <div className="expenses-page">
            <div className="container">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Expenses 💸</h1>
                        <p className="page-subtitle">Track all your expenses</p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancel' : '+ Add Expense'}
                    </button>
                </div>

                {showForm && (
                    <div className="card expense-form slide-up">
                        <h3 className="card-title">Add New Expense</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-2">
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <select
                                        className="form-control"
                                        value={formData.categoryId}
                                        onChange={(e) =>
                                            setFormData({ ...formData, categoryId: e.target.value })
                                        }
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {categories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.icon} {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Amount (₹)</label>

                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="100"
                                        value={formData.amount}
                                        onChange={(e) =>
                                            setFormData({ ...formData, amount: e.target.value })
                                        }
                                        min="0.01"
                                        step="0.01"
                                        required
                                    />
                                    {budgetInfo && (
                                        <div className={`budget-hint ${budgetInfo.willExceed ? 'text-danger' : 'text-muted'}`}
                                            style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                                            {budgetInfo.isOverBudget ? (
                                                <span>❌ Budget already exceeded by ₹{Math.abs(budgetInfo.remaining).toFixed(2)}</span>
                                            ) : budgetInfo.remaining < 0 ? (
                                                <span>❌ Budget exceeded by ₹{Math.abs(budgetInfo.remaining).toFixed(2)}</span>
                                            ) : budgetInfo.willExceed ? (
                                                <span>❌ Amount exceeds remaining budget of ₹{budgetInfo.remaining.toFixed(2)}</span>
                                            ) : (
                                                <span>Remaining Budget: ₹{budgetInfo.remaining.toFixed(2)}</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="What did you buy?"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={formData.date}
                                        onChange={(e) =>
                                            setFormData({ ...formData, date: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={isExceedingBudget}>
                                {budgetInfo && budgetInfo.isOverBudget ? 'Budget Already Exceeded' : isExceedingBudget ? 'Amount Exceeds Budget' : 'Add Expense'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="card filters-card">
                    <div className="filters">
                        <div className="form-group">
                            <label className="form-label">Month</label>
                            <input
                                type="month"
                                className="form-control"
                                value={filter.month}
                                onChange={(e) =>
                                    setFilter({ ...filter, month: e.target.value })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select
                                className="form-control"
                                value={filter.categoryId}
                                onChange={(e) =>
                                    setFilter({ ...filter, categoryId: e.target.value })
                                }
                            >
                                <option value="">All categories</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.icon} {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="total-badge">
                        <span>Total:</span>
                        <strong>₹{totalExpenses.toLocaleString()}</strong>
                    </div>
                </div>

                {loading ? (
                    <div className="spinner-container">
                        <div className="spinner"></div>
                    </div>
                ) : expenses.length === 0 ? (
                    <div className="card text-center empty-state">
                        <h3>No expenses found 🔍</h3>
                        <p className="text-muted">
                            {filter.categoryId || filter.month
                                ? 'Try adjusting your filters'
                                : 'Add your first expense to get started'}
                        </p>
                    </div>
                ) : (
                    <div className="expenses-list">
                        {expenses.map((expense) => (
                            <div key={expense._id} className="expense-card card">
                                <div className="expense-main">
                                    <div className="expense-left">
                                        <span
                                            className="category-badge"
                                            style={{ background: expense.categoryId.color }}
                                        >
                                            {expense.categoryId.icon} {expense.categoryId.name}
                                        </span>
                                        <p className="expense-desc">{expense.description}</p>
                                        <p className="expense-date">
                                            {new Date(expense.date).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="expense-right">
                                        <div className="expense-amt text-danger">
                                            ₹{expense.amount.toLocaleString()}
                                        </div>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDelete(expense._id)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Expenses;
