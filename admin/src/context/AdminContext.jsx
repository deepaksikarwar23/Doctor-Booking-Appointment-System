import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const AdminContext= createContext()

const AdminContextProvider= (props)=>{
    const [aToken, setAToken ] = useState(localStorage.getItem('aToken')? localStorage.getItem('aToken'): '')
    const [doctors , setDoctors] = useState([])
    const [appointments, setAppointments ] = useState([])
    const [dashData, setDashData] = useState(false)



    const backendUrl= import.meta.env.VITE_BACKEND_URL

    // api endpoint to get all doctors data for the admin all doctors page 
    const getAllDoctors= async()=>{
        try {
            const {data}= await axios.post(backendUrl + '/api/admin/all-doctors', {}, {headers:{atoken: aToken}})
            if(data.success){
                setDoctors(data.data.doctors)
                console.log(data.data.doctors)
            }
            else{
                toast.error(data.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // api endpoint to change the availability of a doctor through admin
    const changeAvailability= async(docId)=>{
        try {
            const {data}= await axios.post(backendUrl + '/api/admin/change-availability' , {docId}, {headers:{atoken: aToken}})
            if(data.success){
                toast.success(data.message)
                getAllDoctors()
            }
            else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    // api to get all appointments data for admin page from /api/admin/all-appointments
    const getAllAppointments = async()=>{
       try {
         const {data} = await axios.get(backendUrl + '/api/admin/appointments', {headers:{aToken}})
         if(data.success){
             setAppointments(data.data.appointments)
             console.log(data.data.appointments)
         }else{
             toast.error(data.message)
         }
       } catch (error) {
        console.log(error)
        toast.error(data.message)
       }
    }

    // api endpoint to cancel the appointment from the admin panel 
    const cancelAppointment = async(appointmentId)=>{
        try {
            const {data} = await axios.post(backendUrl + '/api/admin/cancel-appointment' ,  {appointmentId}, {headers:{aToken}})
            if(data.success){
                toast.success(data.message)
                getAllAppointments()
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // api endpoint to get the dashboard data for the admin panel 
    const getDashData= async ()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/admin/dashboard', {headers:{aToken}})
            if(data.success){
                setDashData(data.data.dashData)
                console.log(data.data.dashData)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        const responseInterceptor = axios.interceptors.response.use(
            (response) => {
                return response; // Pass through successful responses
            },
            (error) => {
                // If backend throws an explicit 401, execute automatic eviction!
                if (error.response && error.response.status === 401) {
                    toast.error("Session expired! Redirecting to login...");
                    
                    localStorage.removeItem('aToken'); // Flush local storage cache
                    setAToken(''); // Wipe React state to trigger layout unmounting
                }
                return Promise.reject(error);
            }
        );

        // Clean up memory leak vectors on unmount
        return () => {
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    const value={
        aToken, setAToken,
        backendUrl, 
        doctors, getAllDoctors, changeAvailability,
        appointments, setAppointments, getAllAppointments, 
        cancelAppointment,
        dashData, getDashData,
        
    }

    
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider