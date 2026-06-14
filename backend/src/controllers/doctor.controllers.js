import asyncHandler from "../utils/asyncHandler.js"
import Doctor from '../models/doctor.model.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


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



export { changeAvailability, doctorList, doctorLogin };




