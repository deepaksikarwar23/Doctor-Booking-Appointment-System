import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' 
import { AdminContext } from './context/AdminContext'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Admin/Dashboard'
import AllAppointments from './pages/Admin/AllAppointments'
import AddDoctor from './pages/Admin/AddDoctor'
import DoctorList from './pages/Admin/DoctorList'
import { DoctorContext } from './context/DoctorContext'
import DoctorAppointments from './pages/Doctor/DoctorAppointments'
import DoctorDashboard from './pages/Doctor/DoctorDashboard'
import DoctorProfile from './pages/Doctor/DoctorProfile'

const App = () => {
  const { aToken } = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext)

  // 🔒 THE GLOBAL GUARD GATE
  // If token is missing or wiped by our interceptor, drop EVERYTHING 
  // and force the application window to render only the Login component view.
  if (!aToken || !dToken) {
    return (
      <>
        <ToastContainer />
        <Login />
      </>
    )
  }

  // 🟢 OTHERWISE: Render the secure admin layout tree
  return (
    <div className='bg-[#F8F9FD] min-h-screen'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        
        {/* Added a container wrapper to manage content layouts cleanly across pages */}
        <div className='flex-1 p-5 min-h-[calc(100vh-70px)] bg-[#F8F9FD]'>
          <Routes>
            <Route path='/' element={<Dashboard />} /> {/* 🎯 Tip: Change base path to dashboard instead of empty fragment */}
            <Route path='/admin-dashboard' element={<Dashboard />} />
            <Route path='/all-appointments' element={<AllAppointments />} />
            <Route path='/add-doctors' element={<AddDoctor />} />
            <Route path='/doctors-list' element={<DoctorList />} />

            <Route path='/doctor-dashboard' element={<DoctorDashboard/>}/>
            <Route path='/doctor-appointments' element={<DoctorAppointments/>}/>
            <Route path='/doctor-profile' element={<DoctorProfile/>}/>
          </Routes>
        </div>

      </div>
    </div>
  )
}

export default App