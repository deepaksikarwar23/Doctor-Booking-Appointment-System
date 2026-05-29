import jwt from 'jsonwebtoken'
import asyncHandler from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'

const authAdmin= asyncHandler(async (req, res, next)=>{
    const {atoken}= req.headers

    if(!atoken){
        throw new ApiError(401, 'unauthorized request login again ')
    }

  try {
      const decoded_token= jwt.verify(atoken, process.env.JWT_SECRET)
  
      if(decoded_token.email !== process.env.ADMIN_EMAIL){
          throw new ApiError(401, 'invalid token login again')
      }

      return next()

  } catch (error) {
    throw new ApiError(401, error.message)
  }
})

export default authAdmin