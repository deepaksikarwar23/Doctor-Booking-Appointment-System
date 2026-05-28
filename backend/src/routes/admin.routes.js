import express from 'express'
import { addDoctor } from '../controllers/admin.controllers.js'
import { upload } from '../middlewares/multer.middleware.js'


const adminRouter= express.Router()


adminRouter.route('/add-doctor').post(upload.single('image'),  addDoctor)

export default adminRouter