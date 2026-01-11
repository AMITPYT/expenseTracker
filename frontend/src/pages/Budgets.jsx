import { useState, useEffect } from 'react';
import api from '../services/api';
import BudgetCard from '../components/BudgetCard';
import './Budgets.css';

const Budgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBudgetForm, setShowBudgetForm] = useState(false);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().toISOString().slice(0, 7)
    );
    const [budgetForm, setBudgetForm] = useState({
        categoryId: '',
        limit: '',
    });
    const [categoryForm, setCategoryForm] = useState({
        name: '',
        color: '#6366f1',
        icon: '💰',
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchBudgets();
    }, [selectedMonth]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/expenses/categories');
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchBudgets = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/budgets?month=${selectedMonth}`);
            setBudgets(response.data.data);
        } catch (error) {
            console.error('Error fetching budgets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBudgetSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post('/budgets', {
                ...budgetForm,
                month: selectedMonth,
            });
            setBudgetForm({ categoryId: '', limit: '' });
            setShowBudgetForm(false);
            fetchBudgets();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to set budget');
        }
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post('/expenses/categories', categoryForm);
            setCategoryForm({ name: '', color: '#6366f1', icon: '💰' });
            setShowCategoryForm(false);
            fetchCategories();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create category');
        }
    };

    const handleDeleteBudget = async (id) => {
        if (!confirm('Are you sure you want to delete this budget?')) return;

        try {
            await api.delete(`/budgets/${id}`);
            fetchBudgets();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete budget');
        }
    };

    const emojiOptions = ['💰', '🍔', '🚗', '🎮', '🏠', '💊', '✈️', '🎬', '👕', '📚'];

    return (
        <div className="budgets-page">
            <div className="container">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Budgets 🎯</h1>
                        <p className="page-subtitle">Manage your monthly budgets</p>
                    </div>

                    <div className="header-actions">
                        <input
                            type="month"
                            className="form-control"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        />
                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowCategoryForm(!showCategoryForm)}
                        >
                            {showCategoryForm ? 'Cancel' : '+ Category'}
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowBudgetForm(!showBudgetForm)}
                        >
                            {showBudgetForm ? 'Cancel' : '+ Budget'}
                        </button>
                    </div>
                </div>

                {showCategoryForm && (
                    <div className="card form-card slide-up">
                        <h3 className="card-title">Create New Category</h3>
                        <form onSubmit={handleCategorySubmit}>
                            <div className="grid grid-3">
                                <div className="form-group">
                                    <label className="form-label">Category Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g., Food, Transport"
                                        value={categoryForm.name}
                                        onChange={(e) =>
                                            setCategoryForm({ ...categoryForm, name: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Icon</label>
                                    <div className="icon-selector">
                                        {emojiOptions.map((emoji) => (
                                            <button
                                                key={emoji}
                                                type="button"
                                                className={`icon-option ${categoryForm.icon === emoji ? 'active' : ''
                                                    }`}
                                                onClick={() =>
                                                    setCategoryForm({ ...categoryForm, icon: emoji })
                                                }
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Color</label>
                                    <input
                                        type="color"
                                        className="form-control color-picker"
                                        value={categoryForm.color}
                                        onChange={(e) =>
                                            setCategoryForm({ ...categoryForm, color: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary">
                                Create Category
                            </button>
                        </form>
                    </div>
                )}

                {showBudgetForm && (
                    <div className="card form-card slide-up">
                        <h3 className="card-title">Set Budget</h3>
                        <form onSubmit={handleBudgetSubmit}>
                            <div className="grid grid-2">
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <select
                                        className="form-control"
                                        value={budgetForm.categoryId}
                                        onChange={(e) =>
                                            setBudgetForm({ ...budgetForm, categoryId: e.target.value })
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
                                    <label className="form-label">Budget Limit (₹)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="5000"
                                        value={budgetForm.limit}
                                        onChange={(e) =>
                                            setBudgetForm({ ...budgetForm, limit: e.target.value })
                                        }
                                        min="0"
                                        step="100"
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary">
                                Set Budget
                            </button>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="spinner-container">
                        <div className="spinner"></div>
                    </div>
                ) : budgets.length === 0 ? (
                    <div className="card text-center empty-state">
                        <h3>No budgets set yet! 🎯</h3>
                        <p className="text-muted">
                            {categories.length === 0
                                ? 'Create a category first, then set a budget'
                                : 'Set your first budget to start tracking'}
                        </p>
                    </div>
                ) : (
                    <div className="budgets-grid grid grid-2">
                        {budgets.map((budget) => (
                            <div key={budget._id} className="budget-wrapper">
                                <BudgetCard budget={budget} />
                                <button
                                    className="btn-delete-budget"
                                    onClick={() => handleDeleteBudget(budget._id)}
                                >
                                    Delete Budget
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Budgets;
