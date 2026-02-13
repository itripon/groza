function ScanQR({ 
  isScanning, 
  scanError, 
  cameraInfo, 
  qrInput, 
  setQrInput,
  startScanning, 
  stopScanning, 
  testCameraAccess,
  handleScanQR 
}) {
  return (
    <section className="dashboard-section">
      <h3 className="section-title">Scan QR Code</h3>
      <div className="scan-qr-container">
        <div className="scan-instructions">
          <h4>Validate Funeral Company Authorization</h4>
          <p>Use your camera to scan the QR code or paste the data manually.</p>
        </div>

        {/* Camera Scanner */}
        <div className="camera-scanner-section">
          <div id="qr-reader" className={isScanning ? 'scanning' : 'not-scanning'}></div>
          {scanError && <div className="scan-error">{scanError}</div>}
          {cameraInfo && <div className="camera-info">{cameraInfo}</div>}
          <div className="scanner-controls">
            {!isScanning ? (
              <>
                <button className="submit-btn" onClick={startScanning}>
                  📷 Start Camera Scanner
                </button>
                <button className="secondary-btn" onClick={testCameraAccess}>
                  🔍 Test Camera
                </button>
              </>
            ) : (
              <button className="cancel-btn" onClick={stopScanning}>
                Stop Scanner
              </button>
            )}
          </div>
        </div>

        <div className="recent-validations">
          <h4>Recent Validations</h4>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-time">5 min ago</span>
              <span className="activity-text">Case CASE-2024-001 - APPROVED</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">15 min ago</span>
              <span className="activity-text">Case CASE-2024-003 - APPROVED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ScanQR
