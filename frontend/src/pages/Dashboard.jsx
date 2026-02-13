import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { Html5Qrcode } from 'html5-qrcode'
import './Dashboard.css'
import './Companies.css'
import defaultCompanies from '../data/companies.json'
import defaultCases from '../data/cases.json'
import defaultEmployees from '../data/employees.json'

// Import components
import QuickActions from '../components/QuickActions'
import Companies from '../components/Companies'
import RecentActivity from '../components/RecentActivity'
import Cases from '../components/Cases'
import Employees from '../components/Employees'
import Vehicles from '../components/Vehicles'
import Permits from '../components/Permits'
import CompanyInfo from '../components/CompanyInfo'
import ScanQR from '../components/ScanQR'
import ValidationHistory from '../components/ValidationHistory'

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
  const [scannedData, setScannedData] = useState(null)
  const [showValidationModal, setShowValidationModal] = useState(false)
  const [qrInput, setQrInput] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [scanError, setScanError] = useState('')
  const [cameraInfo, setCameraInfo] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const scannerRef = useRef(null)
  const html5QrCodeRef = useRef(null)
  
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

  const handleScanQR = () => {
    try {
      const data = JSON.parse(qrInput)
      processScannedData(data)
      setQrInput('')
    } catch (error) {
      alert('Invalid QR code data. Please check and try again.')
    }
  }

  const processScannedData = (data) => {
    // Find company and case details
    const company = companies.find(c => c.id === data.companyId)
    const caseData = defaultCases.find(c => c.id === data.caseId)
    const employee = defaultEmployees.find(e => e.companyId === data.companyId)
    const vehicle = defaultVehicles.find(v => v.companyId === data.companyId)
    
    setScannedData({
      ...data,
      company,
      caseData,
      employee,
      vehicle
    })
    setShowValidationModal(true)
    
    // Stop scanning if active
    if (isScanning) {
      stopScanning()
    }
  }

  const testCameraAccess = async () => {
    setCameraInfo('Testing camera access...')
    setScanError('')
    
    try {
      // Detailed browser diagnostics
      const info = []
      info.push(`📱 User Agent: ${navigator.userAgent.substring(0, 50)}...`)
      info.push(`🔒 Protocol: ${window.location.protocol}`)
      info.push(`🌐 Host: ${window.location.host}`)
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices) {
        info.push('❌ navigator.mediaDevices not available')
        info.push('⚠️ SOLUTION: iOS Safari requires HTTPS for camera access')
        info.push('ℹ️ Try accessing via: https://localhost:3000 (if SSL configured)')
        setCameraInfo(info.join('\n'))
        return
      }
      
      if (!navigator.mediaDevices.getUserMedia) {
        info.push('❌ getUserMedia not supported')
        info.push('⚠️ This browser/context does not support camera access')
        setCameraInfo(info.join('\n'))
        return
      }

      info.push('✅ getUserMedia is supported')

      // Try to get cameras
      try {
        const cameras = await Html5Qrcode.getCameras()
        
        if (!cameras || cameras.length === 0) {
          info.push('❌ No cameras found on device')
          setCameraInfo(info.join('\n'))
          return
        }

        info.push(`✅ Found ${cameras.length} camera(s):`)
        cameras.forEach((c, i) => {
          info.push(`   ${i + 1}. ${c.label || 'Camera ' + (i + 1)} (${c.id.substring(0, 20)}...)`)
        })

        // Try to request camera permission
        try {
          info.push('🔄 Requesting camera permission...')
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          })
          stream.getTracks().forEach(track => track.stop())
          info.push('✅ Camera permission granted!')
          info.push('✅ Ready to scan QR codes!')
        } catch (permError) {
          info.push(`❌ Camera permission error: ${permError.name}`)
          info.push(`   Message: ${permError.message}`)
          if (permError.name === 'NotAllowedError') {
            info.push('⚠️ User denied camera permission')
          } else if (permError.name === 'NotFoundError') {
            info.push('⚠️ No camera hardware found')
          }
        }
      } catch (cameraError) {
        info.push(`❌ Camera detection error: ${cameraError.message}`)
      }
      
      setCameraInfo(info.join('\n'))
    } catch (error) {
      setCameraInfo(`❌ Unexpected error: ${error.message}`)
    }
  }

  const startScanning = async () => {
    try {
      setScanError('')
      setIsScanning(true)
      
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode("qr-reader")
      }

      const config = { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        formatsToSupport: [0], // Only QR codes
        supportedScanTypes: [1], // Camera scan only
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true
        }
      }

      // Try to get cameras first to provide better error messages
      try {
        const cameras = await Html5Qrcode.getCameras()
        if (!cameras || cameras.length === 0) {
          throw new Error('No cameras found on this device')
        }
      } catch (cameraError) {
        throw new Error('Unable to access camera. Please check permissions in Settings.')
      }

      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          try {
            const data = JSON.parse(decodedText)
            processScannedData(data)
          } catch (error) {
            setScanError('Invalid QR code format. Please try again.')
          }
        },
        (errorMessage) => {
          // Scanning error - ignore repetitive scanning errors
        }
      )
    } catch (err) {
      console.error('Scanner error:', err)
      let errorMsg = err.message || 'Unable to start camera'
      
      // Provide iOS-specific guidance
      if (errorMsg.includes('NotAllowedError') || errorMsg.includes('Permission')) {
        errorMsg = 'Camera access denied. Go to Settings > Safari > Camera and allow access.'
      } else if (errorMsg.includes('NotFoundError')) {
        errorMsg = 'No camera found. Please ensure your device has a camera.'
      } else if (errorMsg.includes('NotReadableError')) {
        errorMsg = 'Camera is in use by another app. Please close other apps and try again.'
      }
      
      setScanError(errorMsg)
      setIsScanning(false)
    }
  }

  const stopScanning = async () => {
    if (html5QrCodeRef.current && isScanning) {
      try {
        await html5QrCodeRef.current.stop()
        await html5QrCodeRef.current.clear()
        setIsScanning(false)
      } catch (err) {
        console.error('Error stopping scanner:', err)
        setIsScanning(false)
      }
    }
  }

  // Cleanup scanner on unmount or when switching sections
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && isScanning) {
        html5QrCodeRef.current.stop()
          .then(() => html5QrCodeRef.current.clear())
          .catch(err => console.error(err))
      }
    }
  }, [isScanning])

  useEffect(() => {
    if (activeSection !== 'scan-qr' && isScanning) {
      stopScanning()
    }
  }, [activeSection])

  const handleValidationDecision = (approved) => {
    if (approved) {
      alert(`Pickup APPROVED for case ${scannedData.caseId}`)
    } else {
      alert(`Pickup REJECTED for case ${scannedData.caseId}`)
    }
    setShowValidationModal(false)
    setScannedData(null)
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
        return (
          <ScanQR 
            isScanning={isScanning}
            scanError={scanError}
            cameraInfo={cameraInfo}
            qrInput={qrInput}
            setQrInput={setQrInput}
            startScanning={startScanning}
            stopScanning={stopScanning}
            testCameraAccess={testCameraAccess}
            handleScanQR={handleScanQR}
          />
        )
      case 'validation-history':
        return <ValidationHistory />
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

      {showValidationModal && scannedData && (
        <div className="modal-overlay" onClick={() => setShowValidationModal(false)}>
          <div className="modal-content validation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Validation Summary</h3>
              <button className="close-button" onClick={() => setShowValidationModal(false)}>×</button>
            </div>
            <div className="validation-body">
              <div className="validation-section">
                <h4>Company Authorization</h4>
                <div className="validation-grid">
                  <div className="validation-item">
                    <span className="validation-label">Company:</span>
                    <span className="validation-value">{scannedData.company?.name || 'Unknown'}</span>
                  </div>
                  <div className="validation-item">
                    <span className="validation-label">Status:</span>
                    <span className={`status-badge ${scannedData.company?.status?.toLowerCase()}`}>
                      {scannedData.company?.status || 'UNKNOWN'}
                    </span>
                  </div>
                  <div className="validation-item">
                    <span className="validation-label">Location:</span>
                    <span className="validation-value">{scannedData.company?.location || 'N/A'}</span>
                  </div>
                  <div className="validation-item">
                    <span className="validation-label">CUI:</span>
                    <span className="validation-value">{scannedData.company?.cui || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="validation-section">
                <h4>Case Details</h4>
                <div className="validation-grid">
                  <div className="validation-item">
                    <span className="validation-label">Case ID:</span>
                    <span className="validation-value">{scannedData.caseId}</span>
                  </div>
                  <div className="validation-item">
                    <span className="validation-label">Deceased:</span>
                    <span className="validation-value">{scannedData.deceasedName}</span>
                  </div>
                  <div className="validation-item">
                    <span className="validation-label">Date:</span>
                    <span className="validation-value">{scannedData.date}</span>
                  </div>
                  <div className="validation-item">
                    <span className="validation-label">Permits:</span>
                    <span className="validation-value">{scannedData.permits?.join(', ') || 'None'}</span>
                  </div>
                </div>
              </div>

              <div className="validation-section">
                <h4>Employee & Vehicle</h4>
                <div className="validation-grid">
                  <div className="validation-item">
                    <span className="validation-label">Employee:</span>
                    <span className="validation-value">{scannedData.employee?.name || 'Not assigned'}</span>
                  </div>
                  <div className="validation-item">
                    <span className="validation-label">Position:</span>
                    <span className="validation-value">{scannedData.employee?.position || 'N/A'}</span>
                  </div>
                  <div className="validation-item">
                    <span className="validation-label">Vehicle:</span>
                    <span className="validation-value">{scannedData.vehicle?.plateNumber || 'Not assigned'}</span>
                  </div>
                  <div className="validation-item">
                    <span className="validation-label">Vehicle Type:</span>
                    <span className="validation-value">{scannedData.vehicle?.type || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className={`validation-decision ${scannedData.company?.status === 'GREEN' ? 'valid' : 'invalid'}`}>
                {scannedData.company?.status === 'GREEN' ? (
                  <>
                    <span className="decision-icon">✓</span>
                    <span className="decision-text">Company is authorized for pickup</span>
                  </>
                ) : (
                  <>
                    <span className="decision-icon">✗</span>
                    <span className="decision-text">Company is NOT authorized (RED status)</span>
                  </>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={() => handleValidationDecision(false)}
              >
                Reject Handover
              </button>
              <button 
                type="button" 
                className="submit-btn" 
                onClick={() => handleValidationDecision(true)}
                disabled={scannedData.company?.status !== 'GREEN'}
              >
                Approve Handover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
