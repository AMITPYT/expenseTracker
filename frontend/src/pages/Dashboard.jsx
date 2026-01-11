import { useState, useEffect } from 'react';
import api from '../services/api';
import Chart from '../components/Chart';
import BudgetCard from '../components/BudgetCard';
import AlertBanner from '../components/AlertBanner';
import './Dashboard.css';

const Dashboard = () => {
    const [summary, setSummary] = useState(null);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().toISOString().slice(0, 7)
    );

    useEffect(() => {
        fetchData();
    }, [selectedMonth]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [summaryRes, budgetsRes] = await Promise.all([
                api.get(`/expenses/summary?month=${selectedMonth}`),
                api.get(`/budgets?month=${selectedMonth}`),
            ]);

            setSummary(summaryRes.data.data);
            setBudgets(budgetsRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryChartData = () => {
        if (!summary?.categoryBreakdown) return null;

        return {
            labels: summary.categoryBreakdown.map((cat) => cat.category.name),
            datasets: [
                {
                    data: summary.categoryBreakdown.map((cat) => cat.total),
                    backgroundColor: summary.categoryBreakdown.map(
                        (cat) => cat.category.color
                    ),
                    borderColor: summary.categoryBreakdown.map((cat) =>
                        cat.category.color.replace('0.6', '1')
                    ),
                    borderWidth: 2,
                },
            ],
        };
    };

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '2rem' }}>
                <div className="spinner-container">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    const totalBudgetPercentage = summary?.totalBudget > 0
        ? (summary.totalSpent / summary.totalBudget) * 100
        : 0;

    return (
        <div className="dashboard">
            <div className="container">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Dashboard 📊</h1>
                        <p className="dashboard-subtitle">Track your spending and budget</p>
                    </div>

                    <div className="month-selector">
                        <label className="form-label">Month</label>
                        <input
                            type="month"
                            className="form-control"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        />
                    </div>
                </div>

                {summary?.alerts && summary.alerts.length > 0 && (
                    <AlertBanner alerts={summary.alerts} />
                )}

                <div className="stats-grid grid grid-3">
                    <div className="stat-card card">
                        <div className="stat-icon">💰</div>
                        <div className="stat-content">
                            <p className="stat-label">Total Budget</p>
                            <h3 className="stat-value">₹{summary?.totalBudget?.toLocaleString() || 0}</h3>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon">💸</div>
                        <div className="stat-content">
                            <p className="stat-label">Total Spent</p>
                            <h3 className="stat-value text-danger">₹{summary?.totalSpent?.toLocaleString() || 0}</h3>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon">💵</div>
                        <div className="stat-content">
                            <p className="stat-label">Remaining</p>
                            <h3 className={`stat-value ${summary?.remaining >= 0 ? 'text-success' : 'text-danger'}`}>
                                ₹{summary?.remaining?.toLocaleString() || 0}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="card overall-progress-card">
                    <h3 className="card-title">Overall Budget Progress</h3>
                    <div className="progress-info">
                        <span className="progress-label">
                            {totalBudgetPercentage >= 100 ? 'Budget Exceeded!' : 'Budget Used'}
                        </span>
                        <span className="progress-percentage">{totalBudgetPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="progress" style={{ height: '12px' }}>
                        <div
                            className="progress-bar"
                            style={{
                                width: `${Math.min(totalBudgetPercentage, 100)}%`,
                                background:
                                    totalBudgetPercentage >= 100
                                        ? 'var(--danger-gradient)'
                                        : totalBudgetPercentage >= 80
                                            ? 'var(--warning)'
                                            : 'var(--success-gradient)',
                            }}
                        ></div>
                    </div>
                </div>

                <div className="grid grid-2">
                    {summary?.categoryBreakdown && summary.categoryBreakdown.length > 0 && (
                        <div className="card">
                            <h3 className="card-title">Spending by Category</h3>
                            <Chart type="pie" data={getCategoryChartData()} />
                        </div>
                    )}

                    {summary?.recentExpenses && summary.recentExpenses.length > 0 && (
                        <div className="card">
                            <h3 className="card-title">Recent Expenses</h3>
                            <div className="recent-expenses">
                                {summary.recentExpenses.map((expense) => (
                                    <div key={expense._id} className="expense-item">
                                        <div className="expense-info">
                                            <span className="expense-icon">{expense.categoryId.icon}</span>
                                            <div>
                                                <p className="expense-description">{expense.description}</p>
                                                <p className="expense-category">{expense.categoryId.name}</p>
                                            </div>
                                        </div>
                                        <div className="expense-amount text-danger">
                                            ₹{expense.amount.toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {budgets.length > 0 && (
                    <div className="budgets-section">
                        <h2 className="section-title">Budget Breakdown</h2>
                        <div className="grid grid-2">
                            {budgets.map((budget) => (
                                <BudgetCard key={budget._id} budget={budget} />
                            ))}
                        </div>
                    </div>
                )}

                {budgets.length === 0 && (
                    <div className="card text-center empty-state">
                        <h3>No budgets set yet! 🎯</h3>
                        <p className="text-muted">
                            Create your first budget to start tracking your expenses
                        </p>
                        <a href="/budgets" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            Set Budget
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
