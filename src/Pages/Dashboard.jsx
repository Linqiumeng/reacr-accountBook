// src/Pages/Dashboard.jsx - 使用API的新版本
import React, { useState, useEffect } from 'react';
import Header from '../Components/Header/Header';
import TransactionForm from '../Components/TransactionForm/TransactionForm';
import { useAuth } from '../contexts/AuthContext';
import '../Components/RecordList/RecordList.css';

const Dashboard = () => {
    const { token, API_URL } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState({
        income: { total: 0, count: 0 },
        expense: { total: 0, count: 0 },
        balance: 0
    });
    const [todayTransactions, setTodayTransactions] = useState([]);

    // API 调用函数
    const apiCall = async (endpoint, options = {}) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(`${API_URL}${endpoint}`, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error?.message || 'API request failed');
            }
            
            return data;
        } catch (error) {
            throw error;
        }
    };

    // 获取交易记录
    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const data = await apiCall('/transactions?limit=5&sortBy=date&sortOrder=desc');
            setTransactions(data.data.transactions || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 获取财务摘要
    const fetchSummary = async () => {
        try {
            const data = await apiCall('/transactions/summary');
            setSummary(data.data.summary);
        } catch (err) {
            console.error('Failed to fetch summary:', err);
        }
    };

    // 新增：获取今天所有交易
    const fetchTodayTransactions = async () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;
        try {
            const data = await apiCall(`/transactions?date=${todayStr}&limit=100`); // limit可根据实际需要调整
            setTodayTransactions(data.data.transactions || []);
        } catch (err) {
            setTodayTransactions([]);
        }
    };

    // 添加交易
    const addTransaction = async (amount, type, category, description = '') => {
        try {
            // 转换类型以匹配后端API
            const transactionType = type === 'Income' ? 'income' : 'expense';
            
            const transactionData = {
                type: transactionType,
                amount: parseFloat(amount),
                category,
                description: description || '',
                date: new Date().toISOString()
            };

            await apiCall('/transactions', {
                method: 'POST',
                body: JSON.stringify(transactionData)
            });

            // 刷新数据
            await fetchTransactions();
            await fetchSummary();
            
            return { success: true };
        } catch (err) {
            console.error('Failed to add transaction:', err);
            return { success: false, error: err.message };
        }
    };

    // 组件加载时获取数据
    useEffect(() => {
        if (token) {
            fetchTransactions();
            fetchSummary();
            fetchTodayTransactions();
        }
    }, [token]);

    // 今日统计计算（用 todayTransactions 替换原有 todayRecords）
    const todayIncome = todayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    const todayExpense = todayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    const todayCount = todayTransactions.length;

    if (loading) {
        return (
            <div>
                <Header 
                    balance={summary.balance} 
                    income={summary.income.total} 
                    expenditures={summary.expense.total} 
                />
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header 
                balance={summary.balance} 
                income={summary.income.total} 
                expenditures={summary.expense.total} 
            />
            
            <div className="dashboard">
                {/* 快速添加区域 */}
                <div style={{ 
                    maxWidth: '800px', 
                    margin: '0 auto', 
                    padding: '0 20px' 
                }}>
                    <TransactionForm onAddTransaction={addTransaction} />
                    
                    {error && (
                        <div style={{
                            backgroundColor: '#ffebee',
                            color: '#c62828',
                            padding: '15px',
                            borderRadius: '8px',
                            margin: '20px 0',
                            textAlign: 'center'
                        }}>
                            Error: {error}
                        </div>
                    )}
                    
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
                                ${todayIncome.toFixed(2)}
                            </p>
                        </div>
                        <div style={{
                            backgroundColor: '#fff3e0',
                            padding: '20px',
                            borderRadius: '10px',
                            border: '2px solid #FF9800'
                        }}>
                            <h3 style={{ margin: '0 0 10px 0', color: '#f57c00' }}>Today's Expenses</h3>
                            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#e65100', margin: 0 }}>
                                ${todayExpense.toFixed(2)}
                            </p>
                        </div>
                        <div style={{
                            backgroundColor: '#e3f2fd',
                            padding: '20px',
                            borderRadius: '10px',
                            border: '2px solid #2196F3'
                        }}>
                            <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Today's Transactions</h3>
                            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#0d47a1', margin: 0 }}>
                                {todayCount}
                            </p>
                        </div>
                    </div>
                    
                    {/* 最近交易预览 */}
                    <div className="records-section">
                        <h3>Recent Transactions</h3>
                        <div className="records-container">
                            <div className="records-list">
                                {transactions.length === 0 ? (
                                    <div className="empty-records">
                                        <p>No transaction records yet</p>
                                        <small>Add your first transaction!</small>
                                    </div>
                                ) : (
                                    transactions.map((transaction) => (
                                        <div
                                            key={transaction._id}
                                            className={`record-item ${transaction.type === 'expense' ? 'output' : 'income'}`}
                                        >
                                            <div className="record-info">
                                                <div className="record-type">
                                                    {transaction.type === 'income' ? 'Income' : 'Expense'}
                                                </div>
                                                <div className="record-category">{transaction.category}</div>
                                                <div className="record-amount">
                                                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                                                </div>
                                                {transaction.description && (
                                                    <div className="record-description">{transaction.description}</div>
                                                )}
                                                <div className="record-time">
                                                    {new Date(transaction.date || transaction.createdAt).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            {transactions.length >= 5 && (
                                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                    <p style={{ color: '#666' }}>
                                        Showing recent 5 transactions. Total: {summary.income.count + summary.expense.count} transactions.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;