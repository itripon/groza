import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Companies.css'

function Companies({ user, onLogout }) {
  const navigate = useNavigate()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [companies, setCompanies] = useState([
    { id: 1, name: 'Funeral Services Ltd', status: 'GREEN', location: 'Bucharest', employees: 12, vehicles: 5 },
    { id: 2, name: 'Memorial Services SRL', status: 'GREEN', location: 'Cluj-Napoca', employees: 8, vehicles: 3 },
    { id: 3, name: 'Dignitas Funerare', status: 'RED', location: 'Timișoara', employees: 5, vehicles: 2 },
  ])

  const [formData, setFormData] = useState({
    name: '',
    cui: '',
    location: '',
    address: '',
    phone: '',
    email: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateCompany = (e) => {
    e.preventDefault()
    
    const newCompany = {
      id: companies.length + 1,
      name: formData.name,
      status: 'RED', // New companies start as RED until approved
      location: formData.location,
      employees: 0,
      vehicles: 0,
    }

    setCompanies([...companies, newCompany])
    setShowCreateModal(false)
    setFormData({ name: '', cui: '', location: '', address: '', phone: '', email: '' })
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="header-title">GROZA</h1>
          <div className="header-actions">
            <span className="user-email">{user?.email}</span>
            <button onClick={onLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <button className="nav-item" onClick={() => navigate('/dashboard')}>
              <span className="nav-icon">🏠</span>
              Dashboard
            </button>
            <button className="nav-item active">
              <span className="nav-icon">🏢</span>
              Companies
            </button>
            <button className="nav-item">
              <span className="nav-icon">👥</span>
              Users
            </button>
          </nav>
        </aside>

        <div className="dashboard-content">
          <div className="content-header">
            <h2 className="dashboard-title">Companies</h2>
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
        </div>
      </main>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Company</h3>
              <button className="close-button" onClick={() => setShowCreateModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleCreateCompany} className="company-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Company Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cui">CUI (Tax ID) *</label>
                  <input
                    type="text"
                    id="cui"
                    name="cui"
                    value={formData.cui}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location">City *</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Companies
