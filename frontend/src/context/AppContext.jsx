import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const currencySymbol = '$';
    // 🎯 Clean state configuration: no asset import collisions
    const [doctors, setDoctors] = useState([]);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

   const getDoctorsData = async () => {
    try {
        const { data } = await axios.get(backendUrl + '/api/doctor/list')
        
        if (data.success) {
            // 🎯 FIX: Dig deep into data.data.doctors to extract the raw array!
            setDoctors(data.data.doctors) 
        } else {
            toast.error(data.message)
        }
    } catch (error) {
        console.error(error.message)
    }
}

    useEffect(() => {
        if (backendUrl) {
            getDoctorsData();
        }
    }, [backendUrl]);

    const value = {
        doctors,
        currencySymbol,
        getDoctorsData
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;