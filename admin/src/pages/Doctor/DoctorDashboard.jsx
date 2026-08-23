import React from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { useEffect } from 'react'
import { assets } from '../../assets/assets'

const DoctorDashboard = () => {

    const { dToken, dashData, getDashData, completeAppointment, cancelAppointment } = useContext(DoctorContext)
    const { slotDateFormat, currency } = useContext(AppContext)


    useEffect(() => {
        if (dToken) {
            getDashData()
        }
    }, [dToken])


    // 🎯 SMART LOADING GUARD: Check karein agar data abhi tak context me process nahi hua hai
    const isLoading = !dashData ||
        (Array.isArray(dashData) && dashData.length === 0) ||
        (typeof dashData === 'object' && Object.keys(dashData).length === 0);

    // Jab tak backend se genuine object data nahi aa jata, tab tak wait karein
    if (isLoading) {
        return (
            <div className='flex items-center justify-center min-h-[60vh] w-full'>
                <p className='text-gray-400 font-medium animate-pulse'>Dashboard stats is loading...</p>
            </div>
        )
    }

    return (
        <div className='m-5'>
            <div className='flex flex-wrap gap-3 '>

                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14 ' src={assets.earning_icon} alt="" />
                    <div>
                        <p className='text-xl font-semibold text-gray-600 '>{currency} {dashData.earnings}</p>
                        <p className='text-gray-400'>Earnings</p>
                    </div>
                </div>


                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14 ' src={assets.appointments_icon} alt="" />
                    <div>
                        <p className='text-xl font-semibold text-gray-600 '>{dashData.appointments}</p>
                        <p className='text-gray-400'>Appointments</p>
                    </div>
                </div>

                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14 ' src={assets.patients_icon} alt="" />
                    <div>
                        <p className='text-xl font-semibold text-gray-600 '>{dashData.patients}</p>
                        <p className='text-gray-400'>Patients</p>
                    </div>
                </div>

            </div>



            {/* --------------------------------------------- latest appointments ------------------------------------------------------ */}

            <div className='bg-white '>

                <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border border-gray-200'>
                    <img src={assets.list_icon} alt="" />
                    <p className='font-semibold'>Latest Bookings </p>
                </div>

                <div className='pt-4 border border-t-0 border-gray-200'>
                    {
                        dashData.latestAppointments.map((item, index) => (
                            <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
                                <img className='rounded-full w-10 ' src={item.userData.image} alt="" />
                                <div className='flex-1 text-sm '>
                                    <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                                    <p className='text-gray-600 '>{slotDateFormat(item.slotDate)}</p>
                                </div>

                                <div className='flex items-center justify-center gap-4 max-sm:w-full max-sm:justify-end mt-1 sm:mt-0'>
                                    {item.cancelled ? (
                                        <p className='text-red-400 text-xs font-semibold bg-red-50 px-2.5 py-1 rounded-full border border-red-100'>Cancelled</p>
                                    ) : item.isCompleted ? (
                                        <p className='text-green-500 text-xs font-semibold bg-green-50 px-2.5 py-1 rounded-full border border-green-100'>Completed</p>
                                    ) : (
                                        <div className='flex items-center gap-2'>
                                            {/* Cancel Trigger Action */}
                                            <button onClick={() => cancelAppointment(item._id)} className='w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-all cursor-pointer' title='Cancel Appointment'>
                                                <img className='w-8  cursor-pointer' src={assets.cancel_icon} alt="cancel" />
                                            </button>
                                            {/* Complete Trigger Action */}
                                            <button onClick={() => completeAppointment(item._id)} className='w-8 h-8 rounded-full bg-green-50 hover:bg-green-100 flex items-center justify-center transition-all cursor-pointer' title='Mark Completed'>
                                                <img className='w-8 cursor-pointer' src={assets.tick_icon} alt="complete" />
                                            </button>
                                        </div>
                                    )}
                                </div>


                            </div>
                        ))
                    }
                </div>

            </div>





        </div>
    )
}

export default DoctorDashboard