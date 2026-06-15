import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' 
import { AdminContext } from './context/AdminContext'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar' // 🎯 Unified Sidebar Component
import { Routes, Route } from 'react-router-dom'

// Admin Pages
import Dashboard from './pages/Admin/Dashboard'
import AllAppointments from './pages/Admin/AllAppointments'
import AddDoctor from './pages/Admin/AddDoctor'
import DoctorList from './pages/Admin/DoctorList'

// Doctor Pages
import { DoctorContext } from './context/DoctorContext'
import DoctorAppointments from './pages/Doctor/DoctorAppointments'
import DoctorDashboard from './pages/Doctor/DoctorDashboard'
import DoctorProfile from './pages/Doctor/DoctorProfile'

const App = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  // 🔒 THE FIXED GLOBAL GUARD GATE
  // Access is granted if AT LEAST ONE valid token signature exists.
  if (!aToken && !dToken) {
    return (
      <>
        <ToastContainer />
        <Login />
      </>
    )
  }

  return (
    <div className='bg-[#F8F9FD] min-h-screen'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        
        {/* 🎯 The unified sidebar handles its own internal role assertions internally! */}
        <Sidebar />
        
        {/* Main Content Layout Pane Container */}
        <div className='flex-1 p-5 min-h-[calc(100vh-70px)] bg-[#F8F9FD]'>
          <Routes>
            
            {/* 🛡️ CONDITIONALLY REGISTERED ADMINISTRATIVE ROUTES */}
            {aToken && (
              <>
                <Route path='/' element={<Dashboard />} />
                <Route path='/admin-dashboard' element={<Dashboard />} />
                <Route path='/all-appointments' element={<AllAppointments />} />
                <Route path='/add-doctors' element={<AddDoctor />} />
                <Route path='/doctors-list' element={<DoctorList />} />
              </>
            )}

            {/* 🩺 CONDITIONALLY REGISTERED CLINICAL ROUTES */}
            {dToken && (
              <>
                <Route path='/' element={<DoctorDashboard />} />
                <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
                <Route path='/doctor-appointments' element={<DoctorAppointments />} />
                <Route path='/doctor-profile' element={<DoctorProfile />} />
              </>
            )}

          </Routes>
        </div>

      </div>
    </div>
  )
}

export default App