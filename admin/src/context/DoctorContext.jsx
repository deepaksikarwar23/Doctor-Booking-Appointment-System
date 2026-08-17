import axios from "axios";
import { useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";

export const    DoctorContext= createContext()

const DoctorContextProvider= (props)=>{

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [dToken, setDToken] = useState(localStorage.getItem('dToken')? localStorage.getItem('dToken'): '')
    const [dashData, setDashData] = useState([])
    const [appointments, setAppointments] = useState([])
    const [profileData, setProfileData] = useState(false)

    // api endpoint to get the doctor appointment data from backend /doctor/appointments
    const getAppointments = async()=>{
           try {
             const {data} = await axios.get(backendUrl + '/api/doctor/appointments', {headers:{dToken}})
             if(data.success){
                 toast.success(data.message)
                 setAppointments(data.data.appointmentsData.reverse())
                 console.log(data.data.appointmentsData)
             }else{
                 toast.error(data.message)
             }
           } catch (error) {
            console.log(error.message)
            toast.error(error.message)
           }
    }

    // api to complete the appointment in the doctor panel 
    const completeAppointment = async(appointmentId)=>{
        try {
            const {data} = await axios.post(backendUrl + '/api/doctor/complete-appointment', {appointmentId}, {headers:{dtoken: dToken}})
            if(data.success){
                toast.success(data.message)
                getAppointments()
                getDashData()
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // api to cancel the appointment in the doctor panel 
    const cancelAppointment = async(appointmentId)=>{
        try {
            const {data} = await axios.post(backendUrl + '/api/doctor/cancel-appointment', {appointmentId}, {headers:{dtoken: dToken}})
            if(data.success){
                toast.success(data.message)
                getAppointments()
                getDashData()
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

        // api to get the dashboard data for doctor panel 
    const getDashData = async()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/doctor/dashboard', {headers:{dtoken: dToken}})
            if(data.success){
                setDashData(data.data.dashData)
                console.log(data.data.dashData)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // api to get the doctor profile data 
    const getProfileData = async(req, res)=>{
        try {
            
            const {data} = await axios.get(backendUrl + '/api/doctor/profile', {headers:{dtoken: dToken}})
            if(data.success){
                setProfileData(data.data.profileData)
                console.log(data.data.profileData)
            }else{
                console.log(data.message)
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    const value={
        dToken, setDToken,
        backendUrl,
        appointments, setAppointments, 
        getAppointments,
        completeAppointment, cancelAppointment,
         dashData, setDashData, getDashData, 
        profileData, setProfileData, getProfileData



    }
    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider