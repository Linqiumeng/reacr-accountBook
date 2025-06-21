import './Header.css'
import { Link, useLocation } from 'react-router-dom'

const Header = ({ balance, income, expenditures }) => {
    const location = useLocation()
    const currentPage = location.pathname
    
    const getPageTitle = () => {
        switch (currentPage) {
            case '/income': return 'Income Management'
            case '/expense': return 'Expense Management'
            default: return 'This is an Account Book'
        }
    }

    return (
        <div className="Book-Header">
            <p className='sub-title'>{getPageTitle()}</p>
            
            <nav className="navigation">
                <Link to="/" className={`nav-btn ${currentPage === '/' ? 'active' : ''}`}>
                    🏠 主页
                </Link>
                <Link to="/income" className={`nav-btn ${currentPage === '/income' ? 'active' : ''}`}>
                    📈 收入
                </Link>
                <Link to="/expense" className={`nav-btn ${currentPage === '/expense' ? 'active' : ''}`}>
                    📉 支出
                </Link>
            </nav>

            <header>
                <div id="balance">Current Balance: {balance}</div>
                <div id="income">Income: {income}</div>
                <div id="expenditures">Expenditures: {expenditures}</div>
            </header>
        </div>
    );
}

export default Header