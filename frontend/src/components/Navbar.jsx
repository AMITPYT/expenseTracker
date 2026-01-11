import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <Link to="/" className="navbar-brand">
                        <span className="brand-icon">💰</span>
                        <span className="brand-name">ExpenseTracker</span>
                    </Link>

                    {user && (
                        <div className="navbar-menu">
                            <Link to="/" className="nav-link">
                                <span>📊</span> Dashboard
                            </Link>
                            <Link to="/expenses" className="nav-link">
                                <span>💸</span> Expenses
                            </Link>
                            <Link to="/budgets" className="nav-link">
                                <span>🎯</span> Budgets
                            </Link>

                            <div className="navbar-user">
                                <span className="user-name">{user.username}</span>
                                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
