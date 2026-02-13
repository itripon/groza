import defaultPermits from '../data/permits.json'

function Permits({ user }) {
  return (
    <section className="dashboard-section">
      <div className="section-header">
        <h3 className="section-title">Permits</h3>
        <button className="create-button">+ Request Permit</button>
      </div>
      <div className="companies-list">
        <table className="companies-table">
          <thead>
            <tr>
              <th>Permit Type</th>
              <th>Permit Number</th>
              <th>Issue Date</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {defaultPermits.filter(p => p.companyId === user?.companyId).map(permit => (
              <tr key={permit.id}>
                <td className="company-name">{permit.type}</td>
                <td>{permit.permitNumber || 'Pending'}</td>
                <td>{permit.issueDate}</td>
                <td>{permit.expiryDate || 'N/A'}</td>
                <td>
                  <span className={`status-badge ${permit.status === 'valid' ? 'green' : 'red'}`}>
                    {permit.status}
                  </span>
                </td>
                <td>
                  <button className="action-btn">View</button>
                  {permit.status === 'valid' && <button className="action-btn">Download</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default Permits
