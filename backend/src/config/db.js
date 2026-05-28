import mongoose from 'mongoose'
import { DB_NAME } from '../constant.js'

const dbConnection= async ()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log('mongodb connected successfully: ',  connectionInstance.connection.host)
    } catch (error) {
        console.log('MongoDB connection error: ', error);
        throw error
    }
}

export default dbConnection