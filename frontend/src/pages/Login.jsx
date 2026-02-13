import { useState } from 'react'
import './Login.css'
import defaultCompanies from '../data/companies.json'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    // Check global admin
    if (email === 'global_admin@groza.ro' && password === 'grozademo!') {
      onLogin({ email, role: 'GLOBAL_ADMIN' })
      return
    }

    // Check validator
    if (email === 'validator@spital-central.ro' && password === 'grozademo!') {
      onLogin({ email, role: 'VALIDATOR', location: 'Spitalul Central Bucuresti' })
      return
    }

    // Check company admin credentials (combine localStorage and default companies)
    const savedCompanies = JSON.parse(localStorage.getItem('groza_companies') || '[]')
    
    // Merge saved companies with default companies (saved ones take precedence)
    const savedEmails = new Set(savedCompanies.map(c => c.email))
    const allCompanies = [
      ...savedCompanies,
      ...defaultCompanies.filter(c => !savedEmails.has(c.email))
    ]
    
    const company = allCompanies.find(c => c.email === email)
    
    if (company && password === 'grozademo!') {
      onLogin({ email, role: 'FUNERAL_COMPANY_ADMIN', companyId: company.id, companyName: company.name })
      return
    }

    setError('Invalid credentials')
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">GROZA</h1>
          <p className="login-subtitle">Funeral Services Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="form-title">Sign in to your account</h2>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email / Username
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="submit-button">
            Sign In
          </button>

          <div className="login-footer">
            <a href="#" className="forgot-link">
              Forgot password?
            </a>
          </div>
        </form>

      </div>
    </div>
  )
}

export default Login
