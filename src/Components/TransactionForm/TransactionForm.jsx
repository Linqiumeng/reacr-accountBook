import { useState } from "react"
import './TransactionForm.css'


const TransactionForm = ({onAddTransaction})=>{
 
    const [amount, setAmount] = useState('')
    const [type, setType] = useState('')
    const [description, setDescription] = useState('')
    const [message, setMessage] = useState('')
    const [categories, setCategories] = useState([])
    const [categoryInput, setCategoryInput] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')


    // ** Handle user input 
    const handleSubmit = ()=>{

        // ** input validation
        if(!amount.trim()){
            setMessage('Please enter an amount!')
            clearMessage()
            return
        }

        if(!type){
            setMessage('Please choose a type!')
            clearMessage()
            return
        }

        if(!selectedCategory){
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

        onAddTransaction(numAmount, type, selectedCategory, description.trim())

        setMessage(`✓ Adding ${type} Success: $${numAmount}`)
        
        // ** Restore blank
        setAmount('')
        setType('')
        setSelectedCategory('')
        setDescription('')

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

  const handleAddCategory = () => {
    if (categoryInput.trim() && !categories.includes(categoryInput)) {
      setCategories([...categories, categoryInput]);
      setCategoryInput('');
    }
  }

  const handleDeleteCategory = (cat) => {
    setCategories(categories.filter(c => c !== cat));
    if (selectedCategory === cat) setSelectedCategory('');
  }
 
    return (
    <div className="transaction-form">
      <div className="form-row">

        {/* Add New Category */}
        <input 
          className="categoryInput"
          type="text"
          placeholder="Add Category"
          value={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleAddCategory}>Add</button>

        {/* Description */}
      <div className="description-row">
        <input 
          className="descriptionInput" 
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
        
        {/* Amount */}
        <input 
          className="numInput" 
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        

        {/* Select Type */}
        <select 
          id="type" 
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">Select The Type</option>
          <option value="Income">Income</option>
          <option value="Output">Output</option>
        </select>

        {/* Select Category */}
        <select 
          id="category" 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
        
        <button onClick={handleSubmit}>
          Add Transaction
        </button>
      </div>
      
      
      {/* Message */}
      {message && (
        <div className={`result ${message.includes('✓') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {/* Category List */}
      <ul className="category-list">
        {categories.map((cat, index) => (
          <li key={index} className="category-item">
            {cat}
            <button className="delete-btn" onClick={() => handleDeleteCategory(cat)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TransactionForm
