function QuickActions({ setActiveSection }) {
  return (
    <section className="dashboard-section">
      <h3 className="section-title">Quick Actions</h3>
      <div className="action-grid">
        <div className="action-card" onClick={() => setActiveSection('companies')}>
          <div className="action-icon">🏢</div>
          <h4>Create Company</h4>
          <p>Register new funeral company</p>
        </div>
        <div className="action-card">
          <div className="action-icon">✅</div>
          <h4>Approve Changes</h4>
          <p>Review pending company changes</p>
        </div>
        <div className="action-card">
          <div className="action-icon">👥</div>
          <h4>Create User</h4>
          <p>Add new global user</p>
        </div>
        <div className="action-card">
          <div className="action-icon">🚦</div>
          <h4>Manage Status</h4>
          <p>Update company GREEN/RED status</p>
        </div>
      </div>
    </section>
  )
}

export default QuickActions
