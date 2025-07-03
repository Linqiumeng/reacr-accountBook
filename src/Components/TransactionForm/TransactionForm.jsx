// src/Components/TransactionForm/TransactionForm.jsx - API版本
import { useState, useEffect } from "react"
import './TransactionForm.css'

const TransactionForm = ({ onAddTransaction }) => {
    const [amount, setAmount] = useState('')
    const [type, setType] = useState('')
    const [description, setDescription] = useState('')
    const [message, setMessage] = useState('')
    const [categories, setCategories] = useState(() => {
        const saved = localStorage.getItem('categories');
        return saved ? JSON.parse(saved) : [];
    });
    const [categoryInput, setCategoryInput] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [loading, setLoading] = useState(false)

    // Handle user input 
    const handleSubmit = async () => {
        // Input validation
        if (!amount.trim()) {
            setMessage('Please enter an amount!')
            clearMessage()
            return
        }

        if (!type) {
            setMessage('Please choose a type!')
            clearMessage()
            return
        }

        if (!selectedCategory) {
            setMessage('Please choose a category!')
            clearMessage()
            return
        }

        // Convert amount from string to float
        const numAmount = parseFloat(amount)

        if (isNaN(numAmount) || numAmount <= 0) {
            setMessage('Please enter a valid positive number!')
            clearMessage()
            return
        }

        setLoading(true)

        try {
            // Call the parent component's addTransaction function
            const result = await onAddTransaction(numAmount, type, selectedCategory, description.trim())
            
            if (result && !result.success) {
                setMessage(`❌ Error: ${result.error}`)
            } else {
                setMessage(`✓ ${type} of $${numAmount} added successfully!`)
                
                // Reset form
                setAmount('')
                setType('')
                setSelectedCategory('')
                setDescription('')
            }
        } catch (error) {
            setMessage(`❌ Error: ${error.message}`)
        } finally {
            setLoading(false)
        }

        // Clear message after 3 seconds
        clearMessage()
    }
    
    const clearMessage = () => {
        setTimeout(() => {
            setMessage('')
        }, 3000)
    }

    // Submit by pressing "Enter"
    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !loading) {
            handleSubmit()
        }
    }

    const handleAddCategory = () => {
        if (categoryInput.trim() && !categories.includes(categoryInput.trim())) {
            setCategories([...categories, categoryInput.trim()])
            setCategoryInput('')
        }
    }

    const handleDeleteCategory = (cat) => {
        setCategories(categories.filter(c => c !== cat))
        if (selectedCategory === cat) setSelectedCategory('')
    }

    // 每次 categories 变化时写入 localStorage
    useEffect(() => {
        localStorage.setItem('categories', JSON.stringify(categories));
    }, [categories]);

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
                    disabled={loading}
                />
                <button 
                    onClick={handleAddCategory}
                    disabled={loading || !categoryInput.trim()}
                >
                    Add
                </button>

                {/* Description */}
                <div className="description-row">
                    <input 
                        className="descriptionInput" 
                        type="text"
                        placeholder="Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
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
                    disabled={loading}
                    min="0.01"
                    step="0.01"
                />

                {/* Select Type */}
                <select 
                    id="type" 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    disabled={loading}
                >
                    <option value="">Select Type</option>
                    <option value="Income">Income</option>
                    <option value="Output">Expense</option>
                </select>

                {/* Select Category */}
                <select 
                    id="category" 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    disabled={loading}
                >
                    <option value="">Select Category</option>
                    {categories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                    ))}
                </select>
                
                <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                        opacity: loading ? 0.6 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Adding...' : 'Add Transaction'}
                </button>
            </div>
            
            {/* Message */}
            {message && (
                <div className={`result ${message.includes('✓') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            {/* Category List */}
            {categories.length > 0 && (
                <ul className="category-list">
                    {categories.map((cat, index) => (
                        <li key={index} className="category-item">
                            {cat}
                            <button 
                                className="delete-btn" 
                                onClick={() => handleDeleteCategory(cat)}
                                disabled={loading}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default TransactionForm