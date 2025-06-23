import TransactionForm from '../Components/TransactionForm/TransactionForm'
import '../Components/RecordList/RecordList.css'

const Dashboard = ({ transactionProps, recordProps }) => {
    const { records } = recordProps
    
    // 最近5条交易记录
    const recentRecords = records.slice(0, 5)
    
    // 快速统计
    const todayRecords = records.filter(record => {
        const today = new Date().toDateString()
        const recordDate = new Date(record.time).toDateString()
        return today === recordDate
    })
    
    const todayIncome = todayRecords
        .filter(r => r.type === 'Income')
        .reduce((sum, r) => sum + r.amount, 0)
        
    const todayExpense = todayRecords
        .filter(r => r.type === 'Output')
        .reduce((sum, r) => sum + r.amount, 0)

    return (
        <div className="dashboard">
            {/* 快速添加区域 */}
            <div style={{ 
                maxWidth: '800px', 
                margin: '0 auto', 
                padding: '0 20px' 
            }}>
                <TransactionForm {...transactionProps} />
                
                {/* 今日统计 */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    margin: '30px 0',
                    textAlign: 'center'
                }}>
                    <div style={{
                        backgroundColor: '#e8f5e9',
                        padding: '20px',
                        borderRadius: '10px',
                        border: '2px solid #4CAF50'
                    }}>
                        <h3 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>Today's Income</h3>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1b5e20', margin: 0 }}>
                            ${todayIncome}
                        </p>
                    </div>
                    <div style={{
                        backgroundColor: '#fff3e0',
                        padding: '20px',
                        borderRadius: '10px',
                        border: '2px solid #FF9800'
                    }}>
                        <h3 style={{ margin: '0 0 10px 0', color: '#f57c00' }}>Today's Expenditures</h3>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#e65100', margin: 0 }}>
                            ${todayExpense}
                        </p>
                    </div>
                    <div style={{
                        backgroundColor: '#e3f2fd',
                        padding: '20px',
                        borderRadius: '10px',
                        border: '2px solid #2196F3'
                    }}>
                        <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Number of Transactions</h3>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#0d47a1', margin: 0 }}>
                            {todayRecords.length}
                        </p>
                    </div>
                </div>
                
                {/* 最近交易预览 */}
                <div className="records-section">
                    <h3>Current Transaction Record</h3>
                    <div className="records-container">
                        <div className="records-list">
                            {recentRecords.length === 0 ? (
                                <div className="empty-records">
                                    <p>No transaction record</p>
                                    <small>Add your first transaction record!</small>
                                </div>
                            ) : (
                                recentRecords.map((record) => (
                                    <div key={record.id} className={`record-item ${record.type.toLowerCase()}`}>
                                        <div className="record-info">
                                            <div className="record-type">{record.type}</div>
                                            <div className="record-amount">
                                                {record.type === 'Income' ? '+' : '-'}${record.amount}
                                            </div>
                                            {record.description && (
                                                <div className="record-description">{record.description}</div>
                                            )}
                                            <div className="record-time">{record.time}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {records.length > 5 && (
                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                <p style={{ color: '#666' }}>
                                    Show recent 5 records，there are{records.length}records.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard