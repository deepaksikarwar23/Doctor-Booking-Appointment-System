import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {

  const [docImg, setDocImg]= useState(false)
  const [name, setName]= useState('')
  const [email, setEmail]= useState('')
  const [password, setPassword]= useState('')
  const [experience, setExperience]= useState('1 Year')
  const [fees, setFees]= useState('')
  const [about, setAbout]= useState('')
  const [speciality, setSpeciality]= useState('General Physician')
  const [degree , setDegree]= useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')

  const {backendUrl, aToken} = useContext(AdminContext)

  const onSubmitHandler= async(e)=>{
    e.preventDefault()

    try {
      if(!docImg){
        return toast.error('image not selected')
      }

      const formData= new FormData()

      formData.append('image', docImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('experience', experience)
      formData.append('fees', Number(fees))
      formData.append('about', about)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append('address', JSON.stringify({line1:address1, line2:address2}))

      //console log the form data 

      // formData.forEach((val, key)=>{
      //   console.log(`${key}: ${val}`)
      // })

      const {data} = await axios.post(backendUrl + '/api/admin/add-doctor', formData, {headers:{aToken}})

      if(data.success){
        toast.success(data.message)
        setDocImg(false)
        setName('')
        setEmail('')
        setPassword('')
        setAddress1('')
        setAddress2('')
        setDegree('')
        setAbout('')
        setFees('')


      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Add Doctor Error Details:", error);
    
    // 🎯 Captures the "Doctor already exists" message directly from your backend!
    const serverMessage = error.response?.data?.message || error.message;
    toast.error(serverMessage);
    }

  }

  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full max-w-4xl' action="">

      <p className='mb-6 text-xl font-semibold text-gray-800'>Add Doctor</p>

      {/* Main Container Wrapper */}
      <div className='bg-white px-8 py-8 border border-gray-100 rounded-lg w-full shadow-sm'>

        {/* Upload Image Section */}
        <div className='flex items-center gap-4 mb-8 text-gray-500'>
          <label htmlFor="doc-img" className='cursor-pointer group'>
            <img 
              className='w-20 bg-gray-50 p-4 rounded-full border border-dashed border-gray-300 group-hover:border-primary transition-colors' 
              src={docImg? URL.createObjectURL(docImg) : assets.upload_area} 
              alt="Upload Area" 
            />
          </label>
          <input onChange={(e)=>setDocImg(e.target.files[0])} type="file" id='doc-img' hidden />
          <p className='text-sm font-medium text-gray-600'>Upload doctor <br /> picture</p>
        </div>

        {/* Two-Column Inputs Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-gray-600 mb-6'>
          
          {/* Left Column Inputs */}
          <div className='flex flex-col gap-4'>
            <div className='flex-1 flex flex-col gap-1'>
              <p className='text-sm font-medium'>Doctor Name</p>
              <input onChange={(e)=>setName(e.target.value)} value={name} className='border border-gray-200 rounded px-3 py-2 outline-none focus:border-primary text-sm transition-all' type="text" placeholder='Name' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p className='text-sm font-medium'>Doctor Email</p>
              <input onChange={(e)=>setEmail(e.target.value)} value={email} className='border border-gray-200 rounded px-3 py-2 outline-none focus:border-primary text-sm transition-all' type="email" placeholder='Email' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p className='text-sm font-medium'>Doctor Password</p>
              <input onChange={(e)=>setPassword(e.target.value)} value={password} className='border border-gray-200 rounded px-3 py-2 outline-none focus:border-primary text-sm transition-all' type="password" placeholder='Password' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p className='text-sm font-medium'>Experience</p>
              <select onChange={(e)=>setExperience(e.target.value)} value={experience} className='border border-gray-200 rounded px-3 py-2 outline-none focus:border-primary text-sm bg-white cursor-pointer transition-all' name="" id="">
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Year</option>
                <option value="3 Year">3 Year</option>
                <option value="4 Year">4 Year</option>
                <option value="5 Year">5 Year</option>
                <option value="6 Year">6 Year</option>
                <option value="7 Year">7 Year</option>
                <option value="8 Year">8 Year</option>
                <option value="9 Year">9 Year</option>
                <option value="10 Year">10 Year</option>
              </select>
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p className='text-sm font-medium'>Fees</p>
              <input onChange={(e)=>setFees(e.target.value)} value={fees} className='border border-gray-200 rounded px-3 py-2 outline-none focus:border-primary text-sm transition-all' type="number" placeholder='Fees' required />
            </div>
          </div>

          {/* Right Column Inputs */}
          <div className='flex flex-col gap-4'>
            <div className='flex-1 flex flex-col gap-1'>
              <p className='text-sm font-medium'>Speciality</p>
              <select onChange={(e)=>setSpeciality(e.target.value)} value={speciality} className='border border-gray-200 rounded px-3 py-2 outline-none focus:border-primary text-sm bg-white cursor-pointer transition-all' name="" id="">
                <option value="General Physician">General Physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p className='text-sm font-medium'>Education</p>
              <input onChange={(e)=>setDegree(e.target.value)} value={degree} className='border border-gray-200 rounded px-3 py-2 outline-none focus:border-primary text-sm transition-all' type="text" placeholder='Education' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p className='text-sm font-medium'>Address</p>
              <input onChange={(e)=>setAddress1(e.target.value)} value={address1} className='border border-gray-200 rounded px-3 py-2 outline-none focus:border-primary text-sm mb-2 transition-all' type="text" placeholder='Address 1' required />
              <input onChange={(e)=>setAddress2(e.target.value)} value={address2} className='border border-gray-200 rounded px-3 py-2 outline-none focus:border-primary text-sm transition-all' type="text" placeholder='Address 2' required />
            </div>
          </div>

        </div>

        {/* Full-Width About Textarea */}
        <div className='flex flex-col gap-1 text-gray-600 mb-8'>
          <p className='text-sm font-medium mb-1'>About Doctor</p>
          <textarea onChange={(e)=>setAbout(e.target.value)} value={about} className='border border-gray-200 rounded px-3 py-2 w-full outline-none focus:border-primary text-sm resize-none transition-all' placeholder='Write about doctor...' rows={5} required />
        </div>

        {/* Submit Action Button */}
        <button type='submit' className='bg-primary text-white text-sm px-10 py-3 rounded-full hover:bg-opacity-95 transition-all shadow-sm font-medium cursor-pointer'>
          Add Doctor
        </button>

      </div>
    </form>
  )
}

export default AddDoctor