import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorProfile = () => {

    const { dToken, profileData, getProfileData, setProfileData, backendUrl } = useContext(DoctorContext)
    const { currency } = useContext(AppContext)

    const [isEdit, setIsEdit] = useState(false)

    // 🎯 UPDATE PROFILE API CALL
    const updateProfile = async () => {
        try {
            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                available: profileData.available
            }

            const { data } = await axios.post(
                backendUrl + '/api/doctor/update-profile', 
                updateData, 
                { headers: { dtoken: dToken } }
            )

            if (data.success) {
                toast.success(data.message || 'Profile updated successfully!')
                setIsEdit(false)
                getProfileData()
            } else {
                toast.error(data.message || 'Failed to update profile')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
            console.error('Error updating profile:', error)
        }
    }

    useEffect(() => {
        if (dToken) {
            getProfileData()
        }
    }, [dToken])

    if (!profileData) {
        return (
            <div className='flex items-center justify-center min-h-[40vh] text-gray-500'>
                <p>Loading profile details...</p>
            </div>
        )
    }

    // 🎯 SAFE ADDRESS PARSING (Handles both String & Object formats gracefully)
    const address = typeof profileData.address === 'string' 
        ? JSON.parse(profileData.address || '{}') 
        : (profileData.address || { line1: '', line2: '' })

    return (
        <div className='m-5'>
            <div className='flex flex-col gap-4'>

                <div>
                    <img
                        className='bg-primary/80 w-full sm:max-w-64 rounded-lg'
                        src={profileData.image}
                        alt="Doctor Profile"
                    />
                </div>

                {/* Doc Info Section */}
                <div className='flex-1 border border-stone-100 rounded-lg p-8 bg-white'>

                    {/* Name, Degree, Speciality */}
                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>
                        {profileData.name}
                    </p>

                    <div className='flex items-center gap-2 text-gray-600 mt-1'>
                        <p>{profileData.degree} - {profileData.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>
                            {profileData.experience}
                        </button>
                    </div>

                    {/* About Section */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>About:</p>
                        <p className='text-sm text-gray-600 max-w-[700px] mt-1'>
                            {profileData.about}
                        </p>
                    </div>

                    {/* Appointment Fee */}
                    <p className='text-gray-600 font-medium mt-4'>
                        Appointment Fee:{' '}
                        <span className='text-gray-800'>
                            {currency}
                            {isEdit ? (
                                <input
                                    className='border border-gray-300 rounded px-2 py-0.5 ml-1 w-24 focus:outline-primary'
                                    type="number"
                                    onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))}
                                    value={profileData.fees || ''}
                                />
                            ) : (
                                profileData.fees
                            )}
                        </span>
                    </p>

                    {/* Address Section */}
                    <div className='mt-4'>
                        <p className='font-medium text-gray-700'>Address:</p>

                        <p className='text-sm text-gray-600 mt-1'>
                            {isEdit ? (
                                <input
                                    className='border border-gray-300 rounded px-2 py-0.5 w-full max-w-xs focus:outline-primary mb-1'
                                    type="text"
                                    value={address.line1 || ''}
                                    onChange={(e) => {
                                        const updatedAddress = { ...address, line1: e.target.value }
                                        setProfileData(prev => ({ ...prev, address: JSON.stringify(updatedAddress) }))
                                    }}
                                />
                            ) : (
                                address.line1
                            )}
                        </p>

                        <p className='text-sm text-gray-600'>
                            {isEdit ? (
                                <input
                                    className='border border-gray-300 rounded px-2 py-0.5 w-full max-w-xs focus:outline-primary'
                                    type="text"
                                    value={address.line2 || ''}
                                    onChange={(e) => {
                                        const updatedAddress = { ...address, line2: e.target.value }
                                        setProfileData(prev => ({ ...prev, address: JSON.stringify(updatedAddress) }))
                                    }}
                                />
                            ) : (
                                address.line2
                            )}
                        </p>
                    </div>

                    {/* Availability Checkbox */}
                    <div className='flex gap-2 pt-3 items-center'>
                        <input
                            type="checkbox"
                            id="available"
                            checked={profileData.available === true || profileData.available === 'true'}
                            onChange={(e) =>
                                isEdit && setProfileData(prev => ({ ...prev, available: e.target.checked }))
                            }
                            className={`w-4 h-4 accent-primary ${isEdit ? 'cursor-pointer' : 'cursor-default'}`}
                        />
                        <label 
                            htmlFor="available"
                            className={`text-sm font-medium ${isEdit ? 'cursor-pointer text-gray-700' : 'cursor-default text-gray-700'}`}
                        >
                            Available
                        </label>
                    </div>

                    {/* Action Button: Edit vs Save */}
                    {isEdit ? (
                        <button
                            onClick={updateProfile}
                            className='mt-5 px-5 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-full transition-all text-sm font-medium'
                        >
                            Save Information
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEdit(true)}
                            className='mt-5 px-5 py-2 border border-primary text-gray-700 hover:bg-primary hover:text-white rounded-full transition-all text-sm font-medium'
                        >
                            Edit Profile
                        </button>
                    )}

                </div>
            </div>
        </div>
    )
}

export default DoctorProfile