import './RecordList.css'

const RecordList = ({ records, onDeleteRecord, onClearAllRecords })=>{
    return (
    <div className="records-section">
      <h3>Transaction Records</h3>
      <div className="records-container">
        <div className="records-list">
          {records.length === 0 ? (
            <div className="empty-records">
              No transaction records yet
            </div>
          ) : (
            records.map((record, index) => (
              <div key={record.id} className={`record-item ${record.type.toLowerCase()}`}>
                <div className="record-info">
                  <div className="record-type">{record.type}</div>
                  <div className="record-amount">
                    {record.type === 'Income' ? '+' : '-'}${record.amount}
                  </div>
                  <div className="record-time">{record.time}</div>
                </div>
                <button 
                  className="delete-btn" 
                  onClick={() => onDeleteRecord(index)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
        
        {records.length > 0 && (
          <div className="records-actions">
            <button 
              className="danger-btn" 
              onClick={onClearAllRecords}
            >
              Clear All Records
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecordList
