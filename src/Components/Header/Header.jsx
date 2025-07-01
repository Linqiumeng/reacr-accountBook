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
                    🏠 Dashborad
                </Link>
                <Link to="/income" className={`nav-btn ${currentPage === '/income' ? 'active' : ''}`}>
                    📈 Income
                </Link>
                <Link to="/expense" className={`nav-btn ${currentPage === '/expense' ? 'active' : ''}`}>
                    📉 Expense
                </Link>
            </nav>

            <header>
                <div id="balance">Current Balance: {balance.toFixed(2)}</div>
                <div id="income">Income: {income.toFixed(2)}</div>
                <div id="expenditures">Expenditures: {expenditures.toFixed(2)}</div>
            </header>
        </div>
    );
}

export default Header