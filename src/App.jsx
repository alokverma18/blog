import React, { useState, useEffect } from 'react'
import {useDispatch} from 'react-redux'
import authService from './appwrite/auth'
import {login, logout} from './store/authSlice'
import { Header } from './components'
import {Outlet} from 'react-router-dom'

import './App.css'

function App() {

  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    const checkAuthStatus = async (retries = 0) => {
      try {
        const userData = await authService.getCurrentUser()
        if (userData) {
          dispatch(login(userData))
        } else {
          dispatch(logout())
        }
      } catch (error) {
        // Retry for any 401 error (OAuth sessions can take time to establish)
        if (error.code === 401 && retries < 3) {
          setTimeout(() => checkAuthStatus(retries + 1), 1500)
          return
        }
        
        dispatch(logout())
      }
      setLoading(false)
    }

    checkAuthStatus()
  }, [])

  return !loading ? (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  ) : null

}

export default App
