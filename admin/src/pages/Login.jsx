import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets.js'
import { AdminContext } from '../context/AdminContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'


const Login = () => {

    const [state, setState] = useState('Admin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { setAToken, backendUrl } = useContext(AdminContext)

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            if (state === 'Admin') {
                const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
                const token = data.data.token
                if (token) {
                    console.log(token)
                    localStorage.setItem('aToken', token)
                    setAToken(token)
                    toast.success(data.message);
                } else {
                    // display the toast error 
                    toast.error(data.message || "Login failed!");
                }
            }
            else {
                // doctor login logic 
            }
        } catch (error) {
            console.error("Login API Request Failed:", error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || "Invalid credentials or server error!";
            toast.error(errorMessage);
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[5E5E5E] text-sm shadow-lg'>
                <p className='text-2xl font-semibold m-auto'><span className='text-primary'>{state}</span> Login</p>
                <div className='w-full'>
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
                </div>
                <div className='w-full'>
                    <p>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
                </div>
                <button className='bg-primary text-white w-full py-2 rounded-md text-base'>Login</button>

                {
                    state === 'Admin' ?
                        <p>Doctor Login? <span className='text-primary underline cursor-pointer' onClick={() => setState('Doctor')} >Click here</span></p>
                        : <p>Admin Login? <span className='text-primary underline cursor-pointer' onClick={() => setState('Admin')} >Click here</span></p>
                }
            </div>
        </form>
    )
}

export default Login