import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import adminRouter from './routes/admin.routes.js';
import doctorRouter from './routes/doctor.routes.js';
import userRouter from './routes/user.routes.js';


dotenv.config('../.env');

const app= express()



// --------------app configurations 
app.use(express.json())
app.use(urlencoded({extended:true}))
app.use(cors())
 



//admin routes declaration
app.use('/api/admin', adminRouter)


// doctor route declaration 
app.use('/api/doctor', doctorRouter)

// user route declaration
app.use('/api/user' , userRouter)




// At the absolute bottom of your app.js (after all your routes):
app.use((err, req, res, next) => {
    // Express will now intercept your 'ApiError' right here!
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // This converts your custom class data into a clean JSON object!
    res.status(statusCode).json({
        success: false,
        message: message
    });
});


export {app}