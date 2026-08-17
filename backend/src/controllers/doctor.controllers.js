import asyncHandler from "../utils/asyncHandler.js"
import Doctor from '../models/doctor.model.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Appointments from '../models/appointment.model.js'
import Appointment from "../models/appointment.model.js"


// function to change the doctor availability 
const changeAvailability = asyncHandler(async (req, res) => {
    const { docId } = req.body;

    // 🎯 FIX: Pass 'docId' directly as a plain string, NOT as an object { docId }
    const docData = await Doctor.findById(docId);
    
    if (!docData) {
        throw new ApiError(404, "Doctor profile not found");
    }

    // 🎯 FIX: Pass 'docId' directly here as well
    await Doctor.findByIdAndUpdate(docId, { available: !docData.available });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Availability updated successfully'));
});

// function to get doctor list data from backend 
const doctorList= asyncHandler(async(req , res )=>{
    const doctors = await Doctor.find({}).select(['-password' , '-email'])

    if(doctors){
        return res.status(200)
                    .json(new ApiResponse(200, {doctors}, 'doctors data fetched successfully'))
    }

    throw new ApiError(500, 'internal server error while fetching doctors data ')
})

// api to login the doctor 
const doctorLogin = asyncHandler(async(req, res)=>{
    const {email, password} = req.body 

    if(!email || !password){
        throw new ApiError(400, 'All fields are required')
    }

    const doctor = await Doctor.findOne({email})
    if(!doctor){
        throw new ApiError(400, 'Doctor does not exist ')
    }

    const isMatch =await bcrypt.compare(password, doctor.password)

    if(!isMatch){
        throw new ApiError(400, 'Email or password is incorrect')
    }

    const token = jwt.sign({id:doctor._id}, process.env.JWT_SECRET, {expiresIn: '4h'})

    return res.status(200)
            .json(new ApiResponse(200, {token}, 'doctor logged in successfully'))
})

// api to get doctor appointments for the doctor panel 
const doctorAppointments = asyncHandler(async(req, res)=>{
    const docId = req.docId

    const appointmentsData = await Appointments.find({docId})
    if (!appointmentsData || appointmentsData.length === 0) {
        throw new ApiError(404, 'No appointment data found for this doctor')
    }

    return res.status(200)
            .json( new ApiResponse(200, {appointmentsData}, 'appointments data fetched successfully'))
})

// API to mark appointment completed for doctor panel 
const appointmentCompleted = asyncHandler(async (req, res) => {
    const docId = req.docId 
    const { appointmentId } = req.body

    const appointmentData = await Appointment.findById(appointmentId)

    if (!appointmentData || appointmentData.docId.toString() !== docId) {
        throw new ApiError(403, 'Unauthorized action. This appointment does not belong to you.')
    }

    await Appointment.findByIdAndUpdate(appointmentId, { isCompleted: true })

    return res.status(200).json(
        new ApiResponse(200, null, 'Appointment marked as completed successfully')
    )
})

// API to mark appointment cancelled for doctor panel 
const appointmentCancelled = asyncHandler(async (req, res) => {
    const docId = req.docId 
    const { appointmentId } = req.body

    const appointmentData = await Appointment.findById(appointmentId)

    if (!appointmentData || appointmentData.docId.toString() !== docId) {
        throw new ApiError(403, 'Unauthorized action. This appointment does not belong to you.')
    }

    await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true })

    return res.status(200).json(
        new ApiResponse(200, null, 'Appointment cancelled successfully')
    )
})

// API TO FETCH DASHBOARD STATISTICS FOR THE DOCTOR PANEL
const doctorDashboard = asyncHandler(async (req, res) => {
    const docId = req.docId

    const appointments = await Appointment.find({ docId })

    // 🎯 FIX 1: Prevent 400 error crash for brand-new doctors with no appointments
    if (!appointments || appointments.length === 0) {
        const emptyDashData = {
            earnings: 0,
            appointments: 0,
            patients: 0,
            latestAppointments: []
        }
        return res.status(200).json(
            new ApiResponse(200, { dashData: emptyDashData }, 'Dashboard initialized successfully')
        )
    }

    let earnings = 0
    appointments.forEach((item) => {
        if (item.isCompleted || item.payment) {
            earnings += item.amount || 0
        }
    })

    // 3. Extract unique patient IDs using a fast ES6 Set
    const uniquePatients = new Set()
    appointments.forEach((item) => {
        if (item.userId) {
            // 🎯 FIX 3: Cast ObjectId references to raw strings for exact comparison matches
            uniquePatients.add(item.userId.toString())
        }
    })

    // 4. Extract latest 5 appointments safely without mutating the original database array
    // 🎯 FIX 4: Creating a shallow copy before reversing prevents unexpected array order bugs later
    const latestAppointments = [...appointments].reverse().slice(0, 5)

    const dashData = {
        earnings,
        appointments: appointments.length,
        patients: uniquePatients.size,
        latestAppointments
    }

    return res.status(200).json(
        new ApiResponse(200, { dashData }, 'Dashboard analytics aggregated successfully')
    )
})

// api to get the doctor profile for the doctor panel 
const doctorProfile = asyncHandler(async(req, res)=>{
    const docId= req.docId

    const profileData = await Doctor.findById(docId)

    if(!profileData){
        throw new ApiError(404 , 'Doctor not found  ')
    }

    return res.status(200)
            .json(new ApiResponse(200, {profileData}, 'doctor profile data fetched successfully'))
})

// API to update doctor profile data from doctor panel 
const updateDoctorProfile = asyncHandler(async(req, res)=>{
    const docId = req.docId
    const {fees, address, available} = req.body

    const updatedProfileData = await Doctor.findByIdAndUpdate(docId, {fees, address, available}, {new:true})

    if(!updatedProfileData){
        throw new ApiError(400, 'Doctor not found  ')
    }

    return res.status(200)
            .json(new ApiResponse(200, {updatedProfileData}, 'Doctor Profile data updated successfully'))
})

export { changeAvailability, doctorList, doctorLogin, doctorAppointments, appointmentCompleted, appointmentCancelled, doctorDashboard, doctorProfile, updateDoctorProfile };




