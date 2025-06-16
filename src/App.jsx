import { useState } from 'react'
import Header from './Components/Header/Header.jsx'
import TransactionForm from './Components/TransactionForm/TransactionForm.jsx'
import RecordList from './Components/RecordList/RecordList.jsx'


function App() {

  const [balance, setBalance] = useState(0)
  const [income, setIncome] = useState(0)
  const [expenditures, setExpenditures] = useState(0)
  const [records, setRecords] = useState([])
  
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
      />
    </div>
  )
}

export default App