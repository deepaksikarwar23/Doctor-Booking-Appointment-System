import jwt from 'jsonwebtoken'
import asyncHandler from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'

const authUser= asyncHandler(async (req, res, next)=>{
    const {token}= req.headers

    if(!token){
        throw new ApiError(401, 'unauthorized request login again ')
    }

  try {
      const decoded_token= jwt.verify(token, process.env.JWT_SECRET)
    
      if(!decoded_token){
        throw new ApiError(404, 'invalid authorization login again ')
      }

      req.userId = decoded_token._id;
      console.log("1. MIDDLEWARE COMPLETED - req.userId is set to:", req.userId);
    
      return next()

  } catch (error) {
    throw new ApiError(401, error.message)
  }
})

export default authUser