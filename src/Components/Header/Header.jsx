// src/Components/Header/Header.jsx - 最终版本
import './Header.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Header = ({ balance, income, expenditures }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const currentPage = location.pathname
    
    const getPageTitle = () => {
        switch (currentPage) {
            case '/income': return 'Income Management'
            case '/expense': return 'Expense Management'
            default: return 'This is an Account Book'
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const getWelcomeMessage = () => {
        if (user?.profile?.firstName) {
            return `Welcome, ${user.profile.firstName}!`
        }
        return `Welcome, ${user?.username || 'User'}!`
    }

    return (
        <div className="Book-Header">
            <p className='sub-title'>{getPageTitle()}</p>
            
            {/* 用户欢迎信息和登出按钮 */}
            <div className="user-section">
                <span className="welcome-message">{getWelcomeMessage()}</span>
                <button onClick={handleLogout} className="logout-button">
                    🚪 Logout
                </button>
            </div>
            
            <nav className="navigation">
                <Link to="/" className={`nav-btn ${currentPage === '/' ? 'active' : ''}`}>
                    🏠 Dashboard
                </Link>
                <Link to="/income" className={`nav-btn ${currentPage === '/income' ? 'active' : ''}`}>
                    📈 Income
                </Link>
                <Link to="/expense" className={`nav-btn ${currentPage === '/expense' ? 'active' : ''}`}>
                    📉 Expense
                </Link>
            </nav>

            <header>
                <div id="balance">Current Balance: {balance ? balance.toFixed(2) : '0.00'}</div>
                <div id="income">Income: {income ? income.toFixed(2) : '0.00'}</div>
                <div id="expenditures">Expenditures: {expenditures ? expenditures.toFixed(2) : '0.00'}</div>
            </header>
        </div>
    );
}

export default Header