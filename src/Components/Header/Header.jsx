import './Header.css'
const Header = ({balance, income, expenditures })=>{

    return(
        <div className="Book-Header">
            <p className='sub-title'>This is an Account Book</p>
            <header>
                <div id="balance">Current Balance: {balance}</div>
                <div id="income">Income: {income}</div>
                <div id="expenditures">Expenditures: {expenditures}</div>
            </header>
        </div>
    );
}

export default Header