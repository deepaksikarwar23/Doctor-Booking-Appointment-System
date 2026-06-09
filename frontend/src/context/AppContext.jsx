import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const currencySymbol = '$';
    const [doctors, setDoctors] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)
    const [userData, setUserData] = useState(false)


    // function to get the data from backend /doctor/list api and show it to our frontend
    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/list')

            if (data.success) {
                setDoctors(data.data.doctors)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error.message)
        }
    }

    // function to get the user data from backend /user/get-profile and show it to frontend
    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })
            if (data.success) {
                setUserData(data.data.user)
            }
            else {
                toast.error(data.message)
                // 🎯 CLEANUP 1: If backend says success is false, the token is useless
                setToken('')
                localStorage.removeItem('token')
            }
        }
        catch (error) {
            console.log(error)
            toast.error(error.message)
            // 🎯 CLEANUP 2: If network or token validation fails entirely, flush everything
            setToken('')
            localStorage.removeItem('token')
            setUserData(false)
        }
    }

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        } else {
            // If there's no token, ensure user state is completely cleared out
            setUserData(false)
        }
    }, [token]) // 👈 THE DEPENDENCY ARRAY: This tells React to run the function ONLY when 'token' changes!

    useEffect(() => {
        if (backendUrl) {
            getDoctorsData();
        }
    }, [backendUrl]);


    const value = {
        doctors,
        currencySymbol,
        getDoctorsData,
        token, setToken,
        backendUrl,
        userData, setUserData,
        loadUserProfileData
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;