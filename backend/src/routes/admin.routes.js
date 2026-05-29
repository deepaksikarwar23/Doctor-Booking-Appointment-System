import express from 'express'
import { addDoctor, loginAdmin } from '../controllers/admin.controllers.js'
import { upload } from '../middlewares/multer.middleware.js'
import authAdmin from '../middlewares/authAdmin.js'


const adminRouter= express.Router()


adminRouter.route('/add-doctor').post( authAdmin,  upload.single('image'),  addDoctor)
adminRouter.route('/login').post(loginAdmin)

export default adminRouter