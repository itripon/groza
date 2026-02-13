function ValidationHistory() {
  return (
    <section className="dashboard-section">
      <h3 className="section-title">Validation History</h3>
      <div className="companies-list">
        <table className="companies-table">
          <thead>
            <tr>
              <th>Date/Time</th>
              <th>Case ID</th>
              <th>Company</th>
              <th>Decision</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2024-02-13 12:30</td>
              <td className="company-name">CASE-2024-001</td>
              <td>Funeral Services Ltd</td>
              <td><span className="status-badge green">APPROVED</span></td>
              <td><button className="action-btn">View Details</button></td>
            </tr>
            <tr>
              <td>2024-02-13 11:45</td>
              <td className="company-name">CASE-2024-002</td>
              <td>Memorial Services SRL</td>
              <td><span className="status-badge red">REJECTED</span></td>
              <td><button className="action-btn">View Details</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default ValidationHistory
