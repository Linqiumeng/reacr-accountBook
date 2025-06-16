import { useState, useEffect } from 'react'
import Header from './Components/Header/Header.jsx'
import TransactionForm from './Components/TransactionForm/TransactionForm.jsx'
import RecordList from './Components/RecordList/RecordList.jsx'
import { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage } from './utils/Storage.js'


function App() {

  const initialData = loadFromLocalStorage()

  const [balance, setBalance] = useState(initialData.balance)
  const [income, setIncome] = useState(initialData.income)
  const [expenditures, setExpenditures] = useState(initialData.expenditures)
  const [records, setRecords] = useState(initialData.records)
  
  const saveCurrentData = ()=>{
    const CurrentData = {
      balance,
      income,
      expenditures,
      records
    }
    saveToLocalStorage(CurrentData)
  }

  useEffect(()=>{
    saveCurrentData()
  },[balance,income,expenditures,records])


  // ** Handle new Transaction
  const addTransaction = (amount, type)=>{
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

  const resetAllData = () => {
    const confirmMessage = `⚠️ WARNING: This will permanently delete ALL your data including:
• All transaction records (${records.length} records)
• Current balance: $${balance}
• Total income: $${income}  
• Total expenditures: $${expenditures}

This action CANNOT be undone. Are you absolutely sure?`

    if (!window.confirm(confirmMessage)) {
      return
    }

    // 再次确认
    if (!window.confirm('Last chance! This will delete EVERYTHING. Continue?')) {
      return
    }

    // 清除localStorage和重置状态
    clearLocalStorage()
    setBalance(0)
    setIncome(0)
    setExpenditures(0)
    setRecords([])

    alert('✅ All data has been reset successfully!')
  }
  
  return (
    <div>
      <Header 
        balance={balance} 
        income={income} 
        expenditures={expenditures} 
      />
      <TransactionForm onAddTransaction={addTransaction} />
      <RecordList 
        records={records}
        onDeleteRecord={deleteRecord}
        onClearAllRecords={clearAllRecord}
        onResetAllData={resetAllData}
      />
    </div>
  )
}

export default App