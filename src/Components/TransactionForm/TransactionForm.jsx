import { useState } from "react"
import './TransactionForm.css'


const TransactionForm = ({onAddTransaction})=>{
 
    const [amount, setAmount] = useState('')
    const [category, setCategory] = useState('')
    const [message, setMessage] = useState('')


    // ** Handle user input 
    const handleSubmit = ()=>{

        // ** input validation
        if(!amount.trim()){
            setMessage('Please enter an amount!')
            clearMessage()
            return
        }

        if(!category){
            setMessage('Please choose a category!')
            clearMessage()
            return
        }

        // ** Transfer the data given by input from "String" to "Float"
        const numAmount = parseFloat(amount)

        if (isNaN(numAmount) || numAmount <= 0) {
            setMessage('Please enter a valid positive number!')
            clearMessage()
            return
        }

        onAddTransaction(numAmount, category)

        setMessage(`✓ Adding ${category} Success: $${numAmount}`)
        
        // ** Restore blank
        setAmount('')
        setCategory('')

        // 3秒后清除消息
        clearMessage()

    }
    
    const clearMessage = () => {
            setTimeout(() => {
            setMessage('')
            }, 3000)
    }
        

  // ** Submit by Press "Enter"
    const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit()
    }
  }
 
    return (
    <div className="transaction-form">
      <input 
        className="numInput" 
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      
      <select 
        id="category" 
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select a category</option>
        <option value="Income">Income</option>
        <option value="Output">Output</option>
      </select>
      
      <button onClick={handleSubmit}>
        Add Transaction
      </button>
      
      {message && (
        <div className={`result ${message.includes('✓') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </div>
  )
}

export default TransactionForm
