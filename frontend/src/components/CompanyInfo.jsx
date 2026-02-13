function CompanyInfo({ companies, user }) {
  const currentCompany = companies.find(c => c.id === user?.companyId)
  
  return (
    <section className="dashboard-section">
      <h3 className="section-title">Company Information</h3>
      <div className="company-details">
        <div className="detail-row">
          <span className="detail-label">Company Name:</span>
          <span className="detail-value">{currentCompany?.name || 'N/A'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">CUI:</span>
          <span className="detail-value">{currentCompany?.cui || 'N/A'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Status:</span>
          <span className={`status-badge ${currentCompany?.status?.toLowerCase()}`}>
            {currentCompany?.status || 'N/A'}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Location:</span>
          <span className="detail-value">{currentCompany?.location || 'N/A'}</span>
          <button className="action-btn" style={{ marginLeft: '12px' }}>Request Change</button>
        </div>
        <div className="detail-row">
          <span className="detail-label">Address:</span>
          <span className="detail-value">{currentCompany?.address || 'N/A'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Phone:</span>
          <span className="detail-value">{currentCompany?.phone || 'N/A'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Email:</span>
          <span className="detail-value">{currentCompany?.email || 'N/A'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Processing Location:</span>
          <span className="detail-value">{currentCompany?.processingLocation || 'Not set'}</span>
          {!currentCompany?.processingLocation && (
            <button className="action-btn" style={{ marginLeft: '12px' }}>Set Location</button>
          )}
        </div>
      </div>
    </section>
  )
}

export default CompanyInfo
