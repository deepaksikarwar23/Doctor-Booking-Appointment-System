import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorList = () => {

  const { doctors, getAllDoctors, aToken, changeAvailability } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll w-full'>
      {/* Page Heading Title */}
      <h1 className='text-lg font-medium text-slate-700 mb-4'>All Doctors</h1>
      
      {/* Responsive Grid Deck Asset Layout Container */}
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-6 pt-4'>
        {
          doctors && doctors.map((item, index) => {
            return (
              <div 
                key={index} 
                className='border border-indigo-100 rounded-xl max-w-56 overflow-hidden cursor-pointer group bg-white shadow-sm hover:translate-y-[-10px] transition-all duration-500'
              >
                {/* Doctor Avatar Layer */}
                <img 
                  className='bg-indigo-50 group-hover:bg-primary transition-all duration-500 w-full h-48 object-cover object-top' 
                  src={item.image} 
                  alt={item.name} 
                />
                
                {/* Information Descriptive Text Blocks */}
                <div className='p-4'>
                  <p className='text-neutral-800 text-lg font-medium truncate'>{item.name}</p>
                  <p className='text-zinc-600 text-sm truncate'>{item.speciality}</p>
                  
                  {/* Interactive Status Panel Alignment Layout */}
                  <div className='mt-2 flex items-center gap-2 text-sm text-neutral-600'>
                    <input
                      onChange={()=>changeAvailability(item._id)} 
                      type="checkbox" 
                      checked={item.available} 
                      readOnly 
                      className='cursor-pointer accent-primary w-3.5 h-3.5 rounded'
                    />
                    <p className='text-xs font-light text-slate-500'>Available</p>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default DoctorList