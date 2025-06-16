// localStorage 工具函数
const STORAGE_KEY = 'accountBookData'

// 默认数据结构
const defaultData = {
  balance: 0,
  income: 0,
  expenditures: 0,
  records: []
}

// 保存数据到 localStorage
export const saveToLocalStorage = (data) => {
  try {
    const dataToSave = {
      ...data,
      lastUpdated: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    console.log('✅ Data saved to localStorage:', dataToSave)
  } catch (error) {
    console.error('❌ Failed to save to localStorage:', error)
  }
}

// 从 localStorage 读取数据
export const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    
    if (!data) {
      return defaultData
    }
    
    const parsedData = JSON.parse(data)
    
    const validatedData = {
      balance: typeof parsedData.balance === 'number' ? parsedData.balance : 0,
      income: typeof parsedData.income === 'number' ? parsedData.income : 0,
      expenditures: typeof parsedData.expenditures === 'number' ? parsedData.expenditures : 0,
      records: Array.isArray(parsedData.records) ? parsedData.records : []
    }
    
    return validatedData
    
  } catch (error) {
    console.error('❌ Failed to load from localStorage:', error)
    return defaultData
  }
}

// 清除 localStorage 中的所有数据
export const clearLocalStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
    console.log('🗑️ localStorage data cleared')
  } catch (error) {
    console.error('❌ Failed to clear localStorage:', error)
  }
}