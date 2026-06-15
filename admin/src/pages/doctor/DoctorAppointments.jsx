import React from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const DoctorAppointments = () => {

  const {dToken, appointments , getAppointments, completeAppointment, cancelAppointment} = useContext(DoctorContext)
  const {slotDateFormat}= useContext(AppContext)

  useEffect(()=>{
    if(dToken){
      getAppointments()
    }
  }, [dToken])

  return (
  <div className='w-full max-w-6xl m-5'>
            <p className='mb-3 text-lg font-medium text-gray-700'>All Appointments</p>

            <div className='bg-white border border-gray-100 rounded-xl text-sm max-h-[80vh] overflow-y-scroll min-h-[50vh] shadow-sm'>
                
                {/* 📋 TABLE HEADER (Hidden on small mobile viewports) */}
                <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b border-gray-100 bg-gray-50 text-gray-600 font-semibold sticky top-0 z-10'>
                    <p>#</p>
                    <p>Patient</p>
                    <p>Payment</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p>Fees</p>
                    <p className='text-center'>Action</p>
                </div>

                {/* 🔄 DATA LIST CONTAINER */}
                {appointments && appointments.length > 0 ? (
                    appointments.map((item, index) => (
                        <div 
                            key={item._id || index} 
                            className='flex flex-wrap gap-2 justify-between items-center sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] text-gray-500 py-3 px-6 border-b border-gray-100 hover:bg-gray-50 transition-all duration-150'
                        >
                            {/* 1. Index Counter */}
                            <p className='max-sm:hidden font-medium text-gray-300'>{index + 1}</p>

                            {/* 2. Patient Profile Mini-Card */}
                            <div className='flex items-center gap-3'>
                                <img 
                                    className='w-9 h-9 rounded-full object-cover bg-gray-100' 
                                    src={item.userData?.image || assets.profile_pic} 
                                    alt="patient" 
                                />
                                <p className='text-gray-800 font-medium'>{item.userData?.name || 'Walk-in Patient'}</p>
                            </div>

                            {/* 3. Payment Status Badge */}
                            <div>
                                <p className={`text-xs inline-block px-2 py-0.5 border font-semibold rounded-full ${item.payment ? 'bg-green-50 text-green-600 border-green-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                    {item.payment ? 'Online' : 'CASH'}
                                </p>
                            </div>

                            {/* 4. Age Data Row */}
                            <p className='max-sm:text-xs'>
                                <span className='sm:hidden text-gray-400 mr-1'>Age:</span>
                                {item.userData?.dob ? (new Date().getFullYear() - new Date(item.userData.dob).getFullYear()) : 'N/A'}
                            </p>

                            {/* 5. Time Stamp Slot */}
                            <p className='font-medium text-gray-700 max-sm:w-full max-sm:text-xs max-sm:bg-gray-50 max-sm:p-1 max-sm:rounded'>
                                {slotDateFormat(item.slotDate )} | <span className='text-primary font-semibold'>{item.slotTime}</span>
                            </p>

                            {/* 6. Medical Billing Fees */}
                            <p className='font-semibold text-gray-800'>
                                <span className='sm:hidden text-gray-400 mr-1'>Fees:</span>
                                ₹{item.amount || '500'}
                            </p>

                            {/* 7. Context Management Actions Toggle */}
                            <div className='flex items-center justify-center gap-4 max-sm:w-full max-sm:justify-end mt-1 sm:mt-0'>
                                {item.cancelled ? (
                                    <p className='text-red-400 text-xs font-semibold bg-red-50 px-2.5 py-1 rounded-full border border-red-100'>Cancelled</p>
                                ) : item.isCompleted ? (
                                    <p className='text-green-500 text-xs font-semibold bg-green-50 px-2.5 py-1 rounded-full border border-green-100'>Completed</p>
                                ) : (
                                    <div className='flex items-center gap-2'>
                                        {/* Cancel Trigger Action */}
                                        <button onClick={()=>cancelAppointment(item._id)} className='w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-all cursor-pointer' title='Cancel Appointment'>
                                            <img  className='w-8  cursor-pointer' src={assets.cancel_icon} alt="cancel" />
                                        </button>
                                        {/* Complete Trigger Action */}
                                        <button onClick={()=>completeAppointment(item._id)} className='w-8 h-8 rounded-full bg-green-50 hover:bg-green-100 flex items-center justify-center transition-all cursor-pointer' title='Mark Completed'>
                                            <img  className='w-8 cursor-pointer' src={assets.tick_icon} alt="complete" />
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>
                    ))
                ) : (
                    <div className='flex flex-col items-center justify-center py-12 text-gray-400 gap-2'>
                        <p className='text-base font-medium'>No appointments booked yet.</p>
                        <p className='text-xs text-gray-400'>When a patient schedules a slot, it will appear here.</p>
                    </div>
                )}

            </div>
        </div>
  )
}

export default DoctorAppointments