import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import './Dashboard.css'
import './Companies.css'
import defaultCompanies from '../data/companies.json'
import defaultCases from '../data/cases.json'
import defaultEmployees from '../data/employees.json'
import defaultVehicles from '../data/vehicles.json'
import defaultPermits from '../data/permits.json'

// Import components
import QuickActions from '../components/QuickActions'
import Companies from '../components/Companies'
import RecentActivity from '../components/RecentActivity'
import Cases from '../components/Cases'
import Employees from '../components/Employees'
import Vehicles from '../components/Vehicles'
import Permits from '../components/Permits'
import CompanyInfo from '../components/CompanyInfo'
import Validator from '../components/Validator'

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState(() => {
    if (user?.role === 'FUNERAL_COMPANY_ADMIN') return 'cases'
    if (user?.role === 'VALIDATOR') return 'scan-qr'
    return 'quick-actions'
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [selectedCase, setSelectedCase] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Load companies from localStorage or use defaults
  const [companies, setCompanies] = useState(() => {
    const saved = localStorage.getItem('groza_companies')
    if (saved) {
      return JSON.parse(saved)
    }
    return defaultCompanies
  })

  // Save companies to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('groza_companies', JSON.stringify(companies))
  }, [companies])

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
      cui: formData.cui,
      status: 'RED',
      location: formData.location,
      address: formData.address,
      phone: formData.phone,
      email: formData.email,
      employees: 0,
      vehicles: 0,
    }

    setCompanies([...companies, newCompany])
    setShowCreateModal(false)
    setFormData({ name: '', cui: '', location: '', address: '', phone: '', email: '' })
  }

  const handleShowQRCode = (caseItem) => {
    setSelectedCase(caseItem)
    setShowQRModal(true)
  }

  const handleDownloadQR = () => {
    const canvas = document.querySelector('.qr-code-canvas canvas')
    if (canvas) {
      const url = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `QR-${selectedCase.id}.png`
      link.href = url
      link.click()
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'quick-actions':
        return <QuickActions setActiveSection={setActiveSection} />
      case 'companies':
        return <Companies companies={companies} setShowCreateModal={setShowCreateModal} />
      case 'recent-activity':
        return <RecentActivity />
      case 'cases':
        return <Cases user={user} handleShowQRCode={handleShowQRCode} />
      case 'employees':
        return <Employees user={user} />
      case 'vehicles':
        return <Vehicles user={user} />
      case 'permits':
        return <Permits user={user} />
      case 'company-info':
        return <CompanyInfo companies={companies} user={user} />
      case 'scan-qr':
      case 'validation-history':
        return <Validator companies={companies} />
      default:
        return null
    }
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <button 
            className="hamburger-menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
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
        <aside className={`dashboard-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <nav className="sidebar-nav">
            {user?.role === 'GLOBAL_ADMIN' ? (
              <>
                <button
                  className={`nav-item ${activeSection === 'quick-actions' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSection('quick-actions')
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <span className="nav-icon">⚡</span>
                  Quick Actions
                </button>
                <button
                  className={`nav-item ${activeSection === 'companies' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSection('companies')
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <span className="nav-icon">🏢</span>
                  Companies
                </button>
                <button
                  className={`nav-item ${activeSection === 'recent-activity' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSection('recent-activity')
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <span className="nav-icon">📝</span>
                  Recent Activity
                </button>
              </>
            ) : user?.role === 'VALIDATOR' ? (
              <>
                <button
                  className={`nav-item ${activeSection === 'scan-qr' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSection('scan-qr')
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <span className="nav-icon">📱</span>
                  Scan QR Code
                </button>
                <button
                  className={`nav-item ${activeSection === 'validation-history' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSection('validation-history')
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <span className="nav-icon">📜</span>
                  Validation History
                </button>
              </>
            ) : (
              <>
                <button
                  className={`nav-item ${activeSection === 'cases' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSection('cases')
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <span className="nav-icon">📋</span>
                  Cases
                </button>
                <button
                  className={`nav-item ${activeSection === 'employees' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSection('employees')
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <span className="nav-icon">👥</span>
                  Employees
                </button>
                <button
                  className={`nav-item ${activeSection === 'vehicles' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSection('vehicles')
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <span className="nav-icon">🚗</span>
                  Vehicles
                </button>
                <button
                  className={`nav-item ${activeSection === 'permits' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSection('permits')
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <span className="nav-icon">📄</span>
                  Permits
                </button>
                <button
                  className={`nav-item ${activeSection === 'company-info' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSection('company-info')
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <span className="nav-icon">ℹ️</span>
                  Company Info
                </button>
              </>
            )}
          </nav>
        </aside>

        {/* Overlay for mobile menu */}
        {isMobileMenuOpen && (
          <div 
            className="mobile-overlay" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <div className="dashboard-content">
          {/* Status Widgets - Hidden for Validators */}
          {user?.role !== 'VALIDATOR' && (
            <section className="dashboard-section status-widgets-section">
              <div className="widget-grid">
                {user?.role === 'GLOBAL_ADMIN' ? (
                  <>
                    <div className="widget-card">
                      <div className="widget-label">Total Companies</div>
                      <div className="widget-value">24</div>
                      <div className="widget-detail">
                        <span className="status-green">18 GREEN</span>
                        <span className="status-red">6 RED</span>
                      </div>
                    </div>
                    <div className="widget-card">
                      <div className="widget-label">Pending Approvals</div>
                      <div className="widget-value">7</div>
                      <div className="widget-detail">Company changes awaiting review</div>
                    </div>
                    <div className="widget-card">
                      <div className="widget-label">Global Users</div>
                      <div className="widget-value">12</div>
                      <div className="widget-detail">Validators, DSP, Inspectors</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="widget-card">
                      <div className="widget-label">Active Cases</div>
                      <div className="widget-value">5</div>
                      <div className="widget-detail">
                        <span className="status-green">3 In Progress</span>
                        <span className="status-red">2 Pending</span>
                      </div>
                    </div>
                    <div className="widget-card">
                      <div className="widget-label">Employees</div>
                      <div className="widget-value">8</div>
                      <div className="widget-detail">Active personnel</div>
                    </div>
                    <div className="widget-card">
                      <div className="widget-label">Vehicles</div>
                      <div className="widget-value">3</div>
                      <div className="widget-detail">Registered vehicles</div>
                    </div>
                  </>
                )}
              </div>
            </section>
          )}

          <div className="content-header">
            <h2 className="dashboard-title">Dashboard</h2>
            <div className="roles-badge">
              <span className="badge-label">Role:</span>
              <span className="badge">{user?.role || 'N/A'}</span>
            </div>
          </div>

          {renderContent()}
        </div>
      </main>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Company</h3>
            </div>
            <form onSubmit={handleCreateCompany} className="company-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Company Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>CUI (Tax ID) *</label>
                  <input
                    type="text"
                    name="cui"
                    value={formData.cui}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
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
                <button type="submit" className="submit-btn">Create Company</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showQRModal && selectedCase && (
        <div className="modal-overlay" onClick={() => setShowQRModal(false)}>
          <div className="modal-content qr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>QR Code - {selectedCase.id}</h3>
              <button className="close-button" onClick={() => setShowQRModal(false)}>×</button>
            </div>
            <div className="qr-modal-body">
              <div className="qr-code-container">
                <div className="qr-code-canvas">
                  <QRCodeSVG 
                    value={JSON.stringify({
                      caseId: selectedCase.id,
                      companyId: user?.companyId,
                      deceasedName: selectedCase.deceasedName,
                      date: selectedCase.date,
                      permits: selectedCase.permits,
                      timestamp: new Date().toISOString()
                    })}
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="qr-instructions">
                  Scan this QR code at the hospital or validation point to verify company authorization and case details.
                </p>
              </div>
              <div className="qr-info">
                <h4>Case Information</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Case ID:</span>
                    <span className="info-value">{selectedCase.id}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Deceased:</span>
                    <span className="info-value">{selectedCase.deceasedName}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Date:</span>
                    <span className="info-value">{selectedCase.date}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Location:</span>
                    <span className="info-value">{selectedCase.location}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Status:</span>
                    <span className={`status-badge ${selectedCase.status === 'active' ? 'green' : 'red'}`}>
                      {selectedCase.status}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Permits:</span>
                    <span className="info-value">{selectedCase.permits.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={() => setShowQRModal(false)}>
                Close
              </button>
              <button type="button" className="submit-btn" onClick={handleDownloadQR}>
                Download QR Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
