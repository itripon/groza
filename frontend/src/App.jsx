import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Companies from './pages/Companies'

function App() {
  // Initialize from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem('groza_isAuthenticated')
    return savedAuth === 'true'
  })
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('groza_user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  // Save authentication state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('groza_isAuthenticated', isAuthenticated)
    if (user) {
      localStorage.setItem('groza_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('groza_user')
    }
  }, [isAuthenticated, user])

  const handleLogin = (userData) => {
    setIsAuthenticated(true)
    setUser(userData)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem('groza_isAuthenticated')
    localStorage.removeItem('groza_user')
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <Login onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
              <Dashboard user={user} onLogout={handleLogout} /> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/companies" 
          element={
            isAuthenticated ? 
              <Companies user={user} onLogout={handleLogout} /> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
