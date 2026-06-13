import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import validator from 'validator'
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import Doctor from "../models/doctor.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'
import Appointment from '../models/appointment.model.js'

//api for adding doctor
const addDoctor = asyncHandler(async (req, res, next) => {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
    const imageLocalPath = req.file?.path

    // 1.check for all the fields
    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
        // return res.json({success:false, message:'all fields are required'})
        throw new ApiError(400, 'All fields are required')
    }

    if (!imageLocalPath) {
    throw new ApiError(400, 'Doctor profile image file is required from Multer!')
}

    //2.  check for valid email 
    if (!validator.isEmail(email)) {
        throw new ApiError(400, 'please enter valid email format')
    }

    //3.  check for strong password length
    if (password.length < 8) {
        throw new ApiError(400, 'please create a strong password')
    }

    // 4. check if doctor already exist 
    const existingDoctor = await Doctor.findOne({ email })

    if (existingDoctor) {
        throw new ApiError(400, "doctor with same email id already exist")
    }

    // 5. upload the image on cloudinary 
    const cloudinaryUrl = await uploadOnCloudinary(imageLocalPath)

    // check if we got the cloudinary files 
    if (!cloudinaryUrl) {
        throw new ApiError(500, 'error occured in uploading the file on cloudinary')
    }

    // console.log("cloudinary response data: ", cloudinaryUrl)
    const doctorImage = cloudinaryUrl.secure_url

    // getting the public id of the image 
    const imagePublicId = cloudinaryUrl.public_id;

    // 6. create the doctor in database 
    try {
        // throw new Error("Simulated Database Crash"); // write this line to check if image deletion on cloudinary works fine 
        const newDoctor = await Doctor.create({
            name,
            email,
            password,
            speciality,
            degree,
            experience,
            about,
            fees,
            address,
            image: doctorImage,
            date: Date.now()
        })

        // 7. filter out the password field to send back the response 
        const createdDoctor = await Doctor.findById(newDoctor._id).select('-password')
        console.log('doctor registered successfully');

        // 8. gives the response to the frontend or user 
        return res.status(201)
            .json(new ApiResponse(201, createdDoctor, 'Doctor created successfully'))
    } catch (error) {
        console.log("DB registration failed, cleaning up the cloudinary space...")
        await deleteFromCloudinary(imagePublicId)
        throw error
    }
});

// api for login the admin
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, 'email and password are required')
    }

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({email}, process.env.JWT_SECRET, { expiresIn: '2h' })

        return res.status(200)
            .json(new ApiResponse(200, { token }, 'admin logged in successfully'))
    }
    else {
        throw new ApiError(401, 'invalid user credentials')
    }
})

//api to get all doctors data 
const allDoctors= asyncHandler(async(req, res)=>{
    const doctors= await Doctor.find({}).select('-password')
    
    // here mongoose returns an array of doctors from our collection even if it has zero doctors it returns a blank array and a blank array inside an if statement is evaluates to true 
    // if(!doctors){   
    //     throw new ApiError(500, 'internal server error while fetching doctors data ')
    // }

    return res.status(200)
              .json(new ApiResponse(200, {doctors}, "doctors data fetched successfully"))
})

// api to get appointments data for the admin 
const appointmentAdmin = asyncHandler(async(req, res)=>{
    const appointments = await Appointment.find({})

    if(!appointments || appointments.length === 0 ){
        throw new ApiError('400', 'No appointment data found inside the database')
    }

    return res.status(200)
            .json(new ApiResponse(200, {appointments}, 'admin appointment data fetched successfully'))
})

// api to cancel the appointment 
const appointmentCancel = asyncHandler(async(req, res)=>{
    const { appointmentId } = req.body 

    const appointment = await Appointment.findById(appointmentId)

    if (!appointment) {
        throw new ApiError(404, "Appointment record instance not found")
    }

    //  Mark the appointment status as cancelled
    appointment.cancelled = true
    await appointment.save()

    //  CALENDAR RELEASE MECHANISM: Free up the slot for other users
    const { docId, slotDate, slotTime } = appointment

    const doctor = await Doctor.findById(docId)
    if (doctor && doctor.slotsBooked && doctor.slotsBooked[slotDate]) {
        
        // Filter out the cancelled time slot from the database array string list
        doctor.slotsBooked[slotDate] = doctor.slotsBooked[slotDate].filter(
            (time) => time !== slotTime
        )

        // Clean cleanup: If that date has zero appointments left, remove the date key entirely
        if (doctor.slotsBooked[slotDate].length === 0) {
            delete doctor.slotsBooked[slotDate]
        }

        // Tell Mongoose we mutated a nested object structure so it knows to save changes accurately
        doctor.markModified('slotsBooked')
        await doctor.save()
    }

    // Appointment cancelled and slot released successfully
    return res.status(200).json(
        new ApiResponse(200, {}, "Appointment cancelled ")
    )
})


export { addDoctor, loginAdmin, allDoctors, appointmentAdmin, appointmentCancel}