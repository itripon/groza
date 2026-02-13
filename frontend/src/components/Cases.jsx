import defaultCases from '../data/cases.json'

function Cases({ user, handleShowQRCode }) {
  return (
    <section className="dashboard-section">
      <div className="section-header">
        <h3 className="section-title">Cases</h3>
        <button className="create-button">+ New Case</button>
      </div>
      <div className="companies-list">
        <table className="companies-table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Deceased Name</th>
              <th>Date</th>
              <th>Status</th>
              <th>Permits</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {defaultCases.filter(c => c.companyId === user?.companyId).map(caseItem => (
              <tr key={caseItem.id}>
                <td className="company-name">{caseItem.id}</td>
                <td>{caseItem.deceasedName}</td>
                <td>{caseItem.date}</td>
                <td>
                  <span className={`status-badge ${caseItem.status === 'active' ? 'green' : caseItem.status === 'pending' ? 'red' : ''}`}>
                    {caseItem.status}
                  </span>
                </td>
                <td>{caseItem.permits.join(', ')}</td>
                <td>
                  <button className="action-btn">View</button>
                  <button className="action-btn" onClick={() => handleShowQRCode(caseItem)}>QR Code</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default Cases
