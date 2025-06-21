import { useState } from 'react'
import '../Components/RecordList/RecordList.css'

const ExpensePage = ({ recordProps }) => {
    const { records, onDeleteRecord } = recordProps
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('date') // date, amount
    
    // 只显示支出记录
    const expenseRecords = records.filter(record => record.type === 'Output')
    
    // 搜索过滤
    const filteredRecords = expenseRecords.filter(record =>
        record.amount.toString().includes(searchTerm) ||
        record.time.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    // 排序
    const sortedRecords = [...filteredRecords].sort((a, b) => {
        if (sortBy === 'amount') {
            return b.amount - a.amount // 金额从大到小
        }
        return new Date(b.time) - new Date(a.time) // 时间从新到旧
    })
    
    // 统计数据
    const totalExpense = expenseRecords.reduce((sum, record) => sum + record.amount, 0)
    const avgExpense = expenseRecords.length > 0 ? (totalExpense / expenseRecords.length).toFixed(2) : 0
    const maxExpense = expenseRecords.length > 0 ? Math.max(...expenseRecords.map(r => r.amount)) : 0

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
            {/* 支出统计 - 使用橙色主题 */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '15px',
                margin: '20px 0',
                textAlign: 'center'
            }}>
                <div style={{
                    backgroundColor: '#fff3e0',
                    padding: '15px',
                    borderRadius: '10px',
                    border: '2px solid #FF9800'
                }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#f57c00' }}>Total Expense</h4>
                    <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#e65100', margin: 0 }}>
                        ${totalExpense}
                    </p>
                </div>
                <div style={{
                    backgroundColor: '#fff3e0',
                    padding: '15px',
                    borderRadius: '10px',
                    border: '2px solid #FF9800'
                }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#f57c00' }}>Avg Expense</h4>
                    <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#e65100', margin: 0 }}>
                        ${avgExpense}
                    </p>
                </div>
                <div style={{
                    backgroundColor: '#fff3e0',
                    padding: '15px',
                    borderRadius: '10px',
                    border: '2px solid #FF9800'
                }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#f57c00' }}>Highest Expense</h4>
                    <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#e65100', margin: 0 }}>
                        ${maxExpense}
                    </p>
                </div>
                <div style={{
                    backgroundColor: '#fff3e0',
                    padding: '15px',
                    borderRadius: '10px',
                    border: '2px solid #FF9800'
                }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#f57c00' }}>Number of expense</h4>
                    <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#e65100', margin: 0 }}>
                        {expenseRecords.length}
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
                        placeholder="Search Expense Record..."
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
            
            {/* 支出记录列表 */}
            <div className="records-section">
                <h3>Expense Record ({sortedRecords.length})</h3>
                <div className="records-container">
                    <div className="records-list">
                        {sortedRecords.length === 0 ? (
                            <div className="empty-records">
                                <p>No Transaction Record</p>
                                <small>Start Your own Recording!</small>
                            </div>
                        ) : (
                            sortedRecords.map((record) => (
                                <div key={record.id} className="record-item output">
                                    <div className="record-info">
                                        <div className="record-type">{record.type}</div>
                                        <div className="record-amount">-${record.amount}</div>
                                        <div className="record-time">{record.time}</div>
                                    </div>
                                    <button 
                                        className="delete-btn" 
                                        onClick={() => {
                                            const originalIndex = records.findIndex(r => r.id === record.id)
                                            onDeleteRecord(originalIndex)
                                        }}
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
    )
}

export default ExpensePage