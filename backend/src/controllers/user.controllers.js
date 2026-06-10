import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import validator from 'validator'
import bcrypt from 'bcrypt'
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Appointment from '../models/appointment.model.js'
import Doctor from "../models/doctor.model.js";

// api to register the user 
const registerUser = asyncHandler(async (req, res) => {
    const { email, name, password } = req.body

    if (!email || !password || !name) {
        throw new ApiError(400, 'All the fields are required')
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(400, 'Please enter valid email id ')
    }

    if (password.length < 8) {
        throw new ApiError(400, 'please enter a strong password')
    }

    const emailExisting = await User.findOne({ email })

    if (emailExisting) {
        throw new ApiError(400, 'email already exist please enter a different email')
    }

    const createdUser = await User.create({
        email,
        password,
        name
    })

    if (!createdUser) {
        throw new ApiError(500, 'internal server error while registering the user ')
    }

    const token = createdUser.generateAccessToken()

    const loggedInUser = await User.findById(createdUser._id).select('-password')

    return res.status(201)
        .json(new ApiResponse(201, { user: loggedInUser, token }, 'user registered successfully'))
})

// api to login the user 
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new ApiError(400, 'All fields are required')
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(400, 'Please enter a valid email ID')
    }

    const existingUser = await User.findOne({ email })

    if (!existingUser) {
        throw new ApiError(404, 'User does not exist')
    }

    const isMatch = await bcrypt.compare(password, existingUser.password)

    if (!isMatch) {
        throw new ApiError(401, 'Invalid email or password')
    }

    const token = existingUser.generateAccessToken()

    const loggedInUser = await User.findById(existingUser._id).select('-password')

    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .cookie('token', token , options)
        .json(new ApiResponse(
            200,
            { user: loggedInUser, token },
            'User logged in successfully'
        ))
})

// api to get profile data 
const getProfile= asyncHandler(async(req , res )=>{

    const userId = req.userId 

    if(!userId){
        throw new ApiError(404, 'invalid authorization login again ')
    }

    const userProfileData= await User.findById(userId).select('-password')

    return res.status(200)
    .json(new ApiResponse(200, {user: userProfileData} , 'user profile data fetched successfully'))
})

// api to update the data 
const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { name, phone, address, dob, gender } = req.body
    const imageFile = req.file 

    // 1. Validation check
    if (!name && !phone && !address && !dob && !gender && !imageFile) {
        throw new ApiError(400, 'Please enter at least one field to update')
    }

    // 2. Initialize an empty object to store only the fields that are actually being changed
    const updateFields = {}

    // 3. Conditionally build the update object (prevents overwriting data with undefined)
    if (name) updateFields.name = name
    if (phone) updateFields.phone = phone
    if (dob) updateFields.dob = dob
    if (gender) updateFields.gender = gender

    // Handle nested address parsing smoothly if it's sent as a string/JSON from frontend Form Data
    if (address) {
        try {
            updateFields.address = typeof address === 'string' ? JSON.parse(address) : address
        } catch (error) {
            updateFields.address = address // Fallback if it's already a regular string/object
        }
    }

    // 4. Handle Cloudinary upload inside the same execution block
    if (imageFile) {
        const uploadedImage = await uploadOnCloudinary(imageFile.path)
        if (!uploadedImage) {
            throw new ApiError(500, "Failed to upload profile image to Cloudinary")
        }
        updateFields.image = uploadedImage.secure_url   
    }

    // 5. Run ONE single database operation to update everything smoothly!
    // { new: true } returns the fresh, updated user document to the client
    const updatedUserData = await User.findByIdAndUpdate(
        userId, 
        { $set: updateFields }, 
        { new: true, runValidators: true }
    ).select('-password')

    if (!updatedUserData) {
        throw new ApiError(404, "User profile not found")
    }

    // Status 200 is more semantically accurate for updates than 201 (Created)
    return res.status(200)
        .json(new ApiResponse(200, {user: updatedUserData}, 'Profile data updated successfully'))
})

// api to book appointment
const bookAppointment = asyncHandler(async (req, res) => {
    const userId = req.userId 
    const { docId, slotDate, slotTime } = req.body

    // 1. Structural validation check
    if (!docId || !slotDate || !slotTime) {
        throw new ApiError(400, 'All fields (docId, slotDate, slotTime) are required')
    }

    // 2. Fetch target doctor profile data
    const docData = await Doctor.findById(docId).select('-password')
    if (!docData) {
        throw new ApiError(404, 'The requested doctor profile does not exist')
    }

    if (!docData.available) {
        throw new ApiError(400, 'Slots not available ')
    }

    let slotsBooked = docData.slotsBooked || {}

    // 3. Validation Logic for Slot Availability
    if (slotsBooked[slotDate]) {
        if (slotsBooked[slotDate].includes(slotTime)) {
            throw new ApiError(400, 'The requested time slot is already booked')
        } else {
            slotsBooked[slotDate].push(slotTime)
        }
    } else {
        slotsBooked[slotDate] = []
        slotsBooked[slotDate].push(slotTime)
    }

    const userData = await User.findById(userId).select('-password')
    if (!userData) {
        throw new ApiError(404, 'User profile verification failed')
    }

    // Clean up temporary references before saving to history record
    // We make a shallow copy so we don't accidentally mutate the object instance reference
    const docDataCopy = docData.toObject()
    delete docDataCopy.slotsBooked

    // 5. Build transactional history layout
    const appointmentData = {
        userId,
        docId,
        userData,
        docData: docDataCopy,
        amount: docData.fees, // Pulled directly from secure DB source of truth
        slotTime, 
        slotDate,
        date: Date.now(),
        payment: false, // Initial status tracking for upcoming gateway
        cancelled: false
    }

    // 6. Persist appointment instance
    const newAppointment = await Appointment.create(appointmentData)
    if (!newAppointment) {
        throw new ApiError(500, 'Failed to initialize database appointment record')
    }

    // 🎯 THE PRO FIX: Mark the nested object as modified and save the instance directly!
    // This uses your existing 'docData' model instance, bypassing findByIdAndUpdate entirely.
    docData.slotsBooked = slotsBooked
    docData.markModified('slotsBooked') // Tells Mongoose to precisely track the nested object changes
    await docData.save()

    // 8. ENVELOPE SYMMETRY ENFORCEMENT
    return res.status(200).json(
        new ApiResponse(
            200, 
            { appointment: newAppointment }, 
            'Appointment slot secured successfully.'
        )
    )
})

// api to get appointment data for frontend my-appointment page 
const listAppointment = asyncHandler(async(req, res)=>{
    const userId = req.userId
    const appointments = await Appointment.find({userId})

    if(!appointments){
        throw new ApiError(400 , 'no appointment booking data found for this user account' )
    }

    return res.status(200)
                .json(new ApiResponse(200, {appointments}, 'appointment data fetched successfully '))
})

// api to cancel the appointment 
const cancelAppointment = asyncHandler(async(req, res)=>{
    const userId = req.userId
    const { appointmentId } = req.body 

    const appointment = await Appointment.findById(appointmentId)

    if (!appointment) {
        throw new ApiError(404, "Appointment record instance not found")
    }

    // 🔒 SECURITY CHECK: Ensure the user trying to cancel this booking is actually the owner!
    if (appointment.userId.toString() !== userId) {
        throw new ApiError(401, "Unauthorized action: You cannot cancel someone else's appointment")
    }

    // 2. Mark the appointment status as cancelled
    appointment.cancelled = true
    await appointment.save()

    // 📅 3. CALENDAR RELEASE MECHANISM: Free up the slot for other users
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


export { registerUser, loginUser, getProfile , updateProfile , bookAppointment, listAppointment, cancelAppointment }