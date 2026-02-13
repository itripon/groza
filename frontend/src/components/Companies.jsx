function Companies({ companies, setShowCreateModal }) {
  return (
    <section className="dashboard-section">
      <div className="section-header">
        <h3 className="section-title">Companies</h3>
        <button className="create-button" onClick={() => setShowCreateModal(true)}>
          + Create Company
        </button>
      </div>
      <div className="companies-list">
        <table className="companies-table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Location</th>
              <th>Status</th>
              <th>Employees</th>
              <th>Vehicles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map(company => (
              <tr key={company.id}>
                <td className="company-name">{company.name}</td>
                <td>{company.location}</td>
                <td>
                  <span className={`status-badge ${company.status.toLowerCase()}`}>
                    {company.status}
                  </span>
                </td>
                <td>{company.employees}</td>
                <td>{company.vehicles}</td>
                <td>
                  <button className="action-btn">View</button>
                  <button className="action-btn">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default Companies
