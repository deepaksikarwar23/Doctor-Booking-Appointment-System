import express from 'express'
import { addDoctor, allDoctors, loginAdmin } from '../controllers/admin.controllers.js'
import { upload } from '../middlewares/multer.middleware.js'
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailability } from '../controllers/doctor.controllers.js'


const adminRouter= express.Router()


adminRouter.route('/add-doctor').post( authAdmin,  upload.single('image'),  addDoctor)
adminRouter.route('/login').post(loginAdmin)
adminRouter.route('/all-doctors').post(authAdmin, allDoctors)
adminRouter.route('/change-availability').post(authAdmin, changeAvailability)

export default adminRouter