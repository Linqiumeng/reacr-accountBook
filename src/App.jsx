import { useState, useEffect, useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './Components/Header/Header.jsx'
import TransactionForm from './Components/TransactionForm/TransactionForm.jsx'
import RecordList from './Components/RecordList/RecordList.jsx'
import { saveToLocalStorage, loadFromLocalStorage } from './utils/Storage.js'
import Dashboard from './Pages/Dashboard'
import IncomePage from './Pages/IncomePage' 
import ExpensePage from './Pages/ExpensePage.jsx'





function App() {

  const initialData = loadFromLocalStorage()

  const [balance, setBalance] = useState(initialData.balance)
  const [income, setIncome] = useState(initialData.income)
  const [expenditures, setExpenditures] = useState(initialData.expenditures)
  const [records, setRecords] = useState(initialData.records)
  
  const saveCurrentData = useCallback(() => {
    const CurrentData = {
      balance,
      income,
      expenditures,
      records
    }
    saveToLocalStorage(CurrentData)
  }, [balance, income, expenditures, records])

  useEffect(()=>{
    saveCurrentData()
  },[saveCurrentData])


  // ** Handle new Transaction
  const addTransaction = (amount, type, description = '')=>{
    if (type === 'Income'){
      setBalance(prev => prev + amount)
      setIncome(prev => prev + amount)
    }else{
      setBalance(prev => prev - amount)
      setExpenditures(prev => prev + amount)
    }

  const newRecord = {
    type: type,
    amount: amount,
    description: description,
    time: new Date().toLocaleString('en-US',{
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }),
    id: Date.now()
  }

  //** Add new Record
  setRecords(prev => [newRecord, ...prev])

  }

  // ** Delete some Record
  const deleteRecord = (index) => {
    const record = records[index]
    
    // 确认删除
    if (!window.confirm(`Are you sure you want to delete this ${record.type.toLowerCase()} record of $${record.amount}?`)) {
      return
    }
    
    // 更新统计数据
    if (record.type === 'Income') {
      setBalance(prev => prev - record.amount)
      setIncome(prev => prev - record.amount)
    } else if (record.type === 'Output') {
      setBalance(prev => prev + record.amount)
      setExpenditures(prev => prev - record.amount)
    }
    
    // 从记录数组中删除
    setRecords(prev => prev.filter((_, i) => i !== index))
  }

  const clearAllRecord = ()=>{
    if (records.length === 0) {
      alert('No records to clear!')
      return
    }
    
    if (!window.confirm(`Are you sure you want to delete all ${records.length} records? This action cannot be undone.`)) {
      return
    }
    
    // 重置所有数据
    setBalance(0)
    setIncome(0)
    setExpenditures(0)
    setRecords([])
  }

  const transactionProps = { onAddTransaction: addTransaction }
  const recordProps = { 
      records, 
      onDeleteRecord: deleteRecord, 
      onClearAllRecords: clearAllRecord 
  }

  return (
    <Router>
        <div>
            <Header 
                balance={balance} 
                income={income} 
                expenditures={expenditures}
            />
            <Routes>
                <Route 
                    path="/" 
                    element={<Dashboard transactionProps={transactionProps} recordProps={recordProps} />} 
                />
                <Route 
                    path="/income" 
                    element={<IncomePage recordProps={recordProps} />} 
                />
                
                <Route 
                    path="/expense" 
                    element={<ExpensePage recordProps={recordProps} />} 
                />
                
            </Routes>
        </div>
    </Router>
)
}

export default App