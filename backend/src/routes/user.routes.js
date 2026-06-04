import express from 'express'
import { getProfile, loginUser, registerUser, updateProfile } from '../controllers/user.controllers.js'
import authUser from '../middlewares/authUser.js'
import { upload } from '../middlewares/multer.middleware.js'

const userRouter= express.Router()


userRouter.route('/register').post(registerUser)
userRouter.route('/login').post(loginUser)

userRouter.route('/get-profile').get(authUser ,getProfile)
userRouter.route('/update-profile').post(authUser, upload.single('image'), updateProfile)

export default userRouter