// src/Pages/IncomePage.jsx - 更新为使用API
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Header from '../Components/Header/Header'
import '../Components/RecordList/RecordList.css'

const IncomePage = () => {
    const { token, API_URL } = useAuth()
    const [transactions, setTransactions] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('date') // date, amount
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [summary, setSummary] = useState({
        income: { total: 0, count: 0 },
        expense: { total: 0, count: 0 },
        balance: 0
    })

    // 从API获取事务数据
    const fetchTransactions = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${API_URL}/transactions?type=income`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                const data = await response.json()
                setTransactions(data.data.transactions || [])
            } else {
                setError('Failed to fetch transactions')
            }
        } catch (err) {
            setError('Network error while fetching transactions')
        } finally {
            setLoading(false)
        }
    }

    // 获取财务摘要
    const fetchSummary = async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/summary`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                const data = await response.json()
                setSummary(data.data.summary)
            }
        } catch (err) {
            console.error('Failed to fetch summary:', err)
        }
    }

    // 删除事务
    const deleteTransaction = async (transactionId) => {
        if (!window.confirm('Are you sure you want to delete this income record?')) {
            return
        }

        try {
            const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                // 重新获取数据
                await fetchTransactions()
                await fetchSummary()
            } else {
                setError('Failed to delete transaction')
            }
        } catch (err) {
            setError('Network error while deleting transaction')
        }
    }

    // 页面加载时获取数据
    useEffect(() => {
        if (token) {
            fetchTransactions()
            fetchSummary()
        }
    }, [token])

    // 只显示收入记录
    const incomeRecords = transactions.filter(transaction => transaction.type === 'income')
    
    // 搜索过滤
    const filteredRecords = incomeRecords.filter(record =>
        record.amount.toString().includes(searchTerm) ||
        record.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(record.date).toLocaleString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.description && record.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    
    // 排序
    const sortedRecords = [...filteredRecords].sort((a, b) => {
        if (sortBy === 'amount') {
            return b.amount - a.amount // 金额从大到小
        }
        return new Date(b.date) - new Date(a.date) // 时间从新到旧
    })
    
    // 统计数据
    const totalIncome = incomeRecords.reduce((sum, record) => sum + record.amount, 0)
    const avgIncome = incomeRecords.length > 0 ? (totalIncome / incomeRecords.length).toFixed(2) : 0
    const maxIncome = incomeRecords.length > 0 ? Math.max(...incomeRecords.map(r => r.amount)) : 0

    if (loading) {
        return (
            <div>
                <Header 
                    balance={summary.balance} 
                    income={summary.income.total} 
                    expenditures={summary.expense.total}
                />
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>Loading income data...</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Header 
                balance={summary.balance} 
                income={summary.income.total} 
                expenditures={summary.expense.total}
            />
            
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
                {error && (
                    <div style={{
                        backgroundColor: '#fee',
                        border: '1px solid #fcc',
                        color: '#c33',
                        padding: '10px',
                        borderRadius: '5px',
                        marginBottom: '20px'
                    }}>
                        {error}
                    </div>
                )}

                {/* 收入统计 */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '15px',
                    margin: '20px 0',
                    textAlign: 'center'
                }}>
                    <div style={{
                        backgroundColor: '#e8f5e9',
                        padding: '15px',
                        borderRadius: '10px',
                        border: '2px solid #4CAF50'
                    }}>
                        <h4 style={{ margin: '0 0 8px 0', color: '#2e7d32' }}>Total Income</h4>
                        <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1b5e20', margin: 0 }}>
                            ${totalIncome.toFixed(2)}
                        </p>
                    </div>
                    <div style={{
                        backgroundColor: '#e8f5e9',
                        padding: '15px',
                        borderRadius: '10px',
                        border: '2px solid #4CAF50'
                    }}>
                        <h4 style={{ margin: '0 0 8px 0', color: '#2e7d32' }}>Avg Income</h4>
                        <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1b5e20', margin: 0 }}>
                            ${avgIncome}
                        </p>
                    </div>
                    <div style={{
                        backgroundColor: '#e8f5e9',
                        padding: '15px',
                        borderRadius: '10px',
                        border: '2px solid #4CAF50'
                    }}>
                        <h4 style={{ margin: '0 0 8px 0', color: '#2e7d32' }}>Highest Income</h4>
                        <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1b5e20', margin: 0 }}>
                            ${maxIncome.toFixed(2)}
                        </p>
                    </div>
                    <div style={{
                        backgroundColor: '#e8f5e9',
                        padding: '15px',
                        borderRadius: '10px',
                        border: '2px solid #4CAF50'
                    }}>
                        <h4 style={{ margin: '0 0 8px 0', color: '#2e7d32' }}>Number of Income</h4>
                        <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1b5e20', margin: 0 }}>
                            {incomeRecords.length}
                        </p>
                    </div>
                </div>
                
                {/* 搜索和排序 */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    marginBottom: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <div style={{
                        display: 'flex',
                        gap: '15px',
                        flexWrap: 'wrap',
                        alignItems: 'center'
                    }}>
                        <input
                            type="text"
                            placeholder="Search by amount, time, or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                flex: 1,
                                minWidth: '200px',
                                padding: '10px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '16px'
                            }}
                        />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{
                                padding: '10px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '16px'
                            }}
                        >
                            <option value="date">Sort By Time</option>
                            <option value="amount">Sort By Amount</option>
                        </select>
                    </div>
                </div>
                
                {/* 收入记录列表 */}
                <div className="records-section">
                    <h3>Income Records ({sortedRecords.length})</h3>
                    <div className="records-container">
                        <div className="records-list">
                            {sortedRecords.length === 0 ? (
                                <div className="empty-records">
                                    <p>No Income Records</p>
                                    <small>Start your income recording!</small>
                                </div>
                            ) : (
                                sortedRecords.map((record) => (
                                    <div key={record._id} className="record-item income">
                                        <div className="record-info">
                                            <div className="record-type">Income</div>
                                            <div className="record-category">{record.category}</div>
                                            <div className="record-amount">+${record.amount.toFixed(2)}</div>
                                            {record.description && (
                                                <div className="record-description">{record.description}</div>
                                            )}
                                            <div className="record-time">
                                                {new Date(record.date).toLocaleString()}
                                            </div>
                                        </div>
                                        <button 
                                            className="delete-btn" 
                                            onClick={() => deleteTransaction(record._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IncomePage;