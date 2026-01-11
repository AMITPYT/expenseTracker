import './BudgetCard.css';

const BudgetCard = ({ budget }) => {
    const { categoryId, limit, spent, remaining, percentage } = budget;

    if (!categoryId) return null;

    const getProgressColor = () => {
        if (percentage >= 100) return 'var(--danger-gradient)';
        if (percentage >= 80) return 'var(--warning)';
        return 'var(--success-gradient)';
    };

    const getStatusText = () => {
        if (percentage >= 100) return 'Exceeded!';
        if (percentage >= 90) return 'Almost there!';
        if (percentage >= 80) return 'Watch out!';
        return 'On track';
    };

    return (
        <div className="budget-card card">
            <div className="budget-header">
                <div className="category-info">
                    <span className="category-icon" style={{ fontSize: '2rem' }}>
                        {categoryId.icon}
                    </span>
                    <div>
                        <h4 className="category-name">{categoryId.name}</h4>
                        <p className="budget-status text-muted">{getStatusText()}</p>
                    </div>
                </div>
                <div className="category-color" style={{
                    background: categoryId.color,
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    boxShadow: `0 0 20px ${categoryId.color}50`
                }}></div>
            </div>

            <div className="budget-amounts">
                <div className="amount-item">
                    <span className="amount-label">Budget</span>
                    <span className="amount-value">₹{limit.toLocaleString()}</span>
                </div>
                <div className="amount-item">
                    <span className="amount-label">Spent</span>
                    <span className="amount-value text-danger">₹{spent?.toLocaleString() || 0}</span>
                </div>
                <div className="amount-item">
                    <span className="amount-label">Remaining</span>
                    <span className={`amount-value ${remaining >= 0 ? 'text-success' : 'text-danger'}`}>
                        ₹{remaining?.toLocaleString() || limit.toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="progress-section">
                <div className="progress-header">
                    <span className="progress-label">Progress</span>
                    <span className="progress-percentage">{percentage?.toFixed(1) || 0}%</span>
                </div>
                <div className="progress">
                    <div
                        className="progress-bar"
                        style={{
                            width: `${Math.min(percentage || 0, 100)}%`,
                            background: getProgressColor()
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default BudgetCard;
