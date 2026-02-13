import { useState, useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import defaultCompanies from '../data/companies.json'
import defaultCases from '../data/cases.json'
import defaultEmployees from '../data/employees.json'
import defaultVehicles from '../data/vehicles.json'
import ScanQR from './ScanQR'
import ValidationHistory from './ValidationHistory'

function Validator({ companies }) {
  const [scannedData, setScannedData] = useState(null)
  const [showValidationModal, setShowValidationModal] = useState(false)
  const [qrInput, setQrInput] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [scanError, setScanError] = useState('')
  const [cameraInfo, setCameraInfo] = useState('')
  const html5QrCodeRef = useRef(null)

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
    // Validate required fields
    if (!data || !data.caseId || !data.companyId) {
      setScanError('Invalid QR code format. Missing required case information.')
      return
    }

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
            console.log('=== QR CODE SCANNED ===')
            console.log('Raw text:', decodedText)
            console.log('Length:', decodedText.length)
            console.log('First 50 chars:', decodedText.substring(0, 50))
            
            // Try to parse as JSON
            const data = JSON.parse(decodedText)
            console.log('✅ Successfully parsed JSON:', data)
            
            // Check if it has the required fields
            if (!data.caseId || !data.companyId) {
              console.warn('⚠️ Missing required fields. caseId:', data.caseId, 'companyId:', data.companyId)
              setScanError('QR code is missing required case information.')
              return
            }
            
            console.log('✅ Valid GROZA QR code, processing...')
            processScannedData(data)
          } catch (error) {
            console.error('❌ QR parsing error:', error)
            console.error('Error details:', error.message)
            setScanError(`Unable to parse QR code: ${error.message}`)
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

  // Cleanup scanner on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && isScanning) {
        html5QrCodeRef.current.stop()
          .then(() => html5QrCodeRef.current.clear())
          .catch(err => console.error(err))
      }
    }
  }, [isScanning])

  const handleValidationDecision = (approved) => {
    if (approved) {
      alert(`Pickup APPROVED for case ${scannedData.caseId}`)
    } else {
      alert(`Pickup REJECTED for case ${scannedData.caseId}`)
    }
    setShowValidationModal(false)
    setScannedData(null)
  }

  return (
    <>
      <ScanQR
        qrInput={qrInput}
        setQrInput={setQrInput}
        handleScanQR={handleScanQR}
        isScanning={isScanning}
        startScanning={startScanning}
        stopScanning={stopScanning}
        scanError={scanError}
        testCameraAccess={testCameraAccess}
        cameraInfo={cameraInfo}
      />
      <ValidationHistory />

      {/* Validation Modal */}
      {showValidationModal && scannedData && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>Validate Pickup</h3>
              <button className="close-button" onClick={() => setShowValidationModal(false)}>×</button>
            </div>
            <div className="validation-modal-body">
              <div className="validation-section">
                <h4>Case Information</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Case ID:</span>
                    <span className="info-value">{scannedData.caseId}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Deceased:</span>
                    <span className="info-value">{scannedData.deceasedName}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Date:</span>
                    <span className="info-value">{scannedData.date}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Permits:</span>
                    <span className="info-value">{scannedData.permits?.join(', ')}</span>
                  </div>
                </div>
              </div>

              {scannedData.company && (
                <div className="validation-section">
                  <h4>Company Details</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Name:</span>
                      <span className="info-value">{scannedData.company.name}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Location:</span>
                      <span className="info-value">{scannedData.company.location}</span>
                    </div>
                  </div>
                </div>
              )}

              {scannedData.employee && (
                <div className="validation-section">
                  <h4>Employee</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Name:</span>
                      <span className="info-value">{scannedData.employee.name}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Role:</span>
                      <span className="info-value">{scannedData.employee.role}</span>
                    </div>
                  </div>
                </div>
              )}

              {scannedData.vehicle && (
                <div className="validation-section">
                  <h4>Vehicle</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">License Plate:</span>
                      <span className="info-value">{scannedData.vehicle.licensePlate}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Type:</span>
                      <span className="info-value">{scannedData.vehicle.type}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="modal-actions" style={{ marginTop: '24px' }}>
                <button 
                  className="cancel-btn" 
                  onClick={() => handleValidationDecision(false)}
                  style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: 'none' }}
                >
                  ✕ Reject
                </button>
                <button 
                  className="submit-btn" 
                  onClick={() => handleValidationDecision(true)}
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                >
                  ✓ Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Validator
