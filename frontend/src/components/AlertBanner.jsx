import './AlertBanner.css';

const AlertBanner = ({ alerts, onDismiss }) => {
    if (!alerts || alerts.length === 0) return null;

    return (
        <div className="alerts-container slide-up">
            {alerts.map((alert, index) => (
                <div key={index} className={`alert alert-${alert.type}`}>
                    <span className="alert-icon">
                        {alert.type === 'danger' ? '🚨' : alert.type === 'warning' ? '⚠️' : 'ℹ️'}
                    </span>
                    <span className="alert-message">{alert.message}</span>
                    {onDismiss && (
                        <button
                            className="alert-close"
                            onClick={() => onDismiss(alert._id)}
                            aria-label="Close"
                        >
                            ✕
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default AlertBanner;
