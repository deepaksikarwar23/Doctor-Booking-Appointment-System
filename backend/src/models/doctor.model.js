import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const doctorSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,        // store the received string from the cloudinary 
        required:true
    },
    speciality:{
        type:String,
        required:true
    },
    degree:{
        type:String,
        required:true
    },
    experience:{
        type:String,
        required:true
    },
    about:{
        type:String,
        required:true
    },
    fees:{
        type:Number,
        required:true
    },
    address:{
        type:Object,
        required:true
    },
    available:{
        type:Boolean,
        default:true
    },
    date:{
        type:Number,
        required:true
    },
    slotsBooked:{
       type:Object,
       default:{}
    },
  
},
{ 
    timestamps:true,
    minimize:false})

    doctorSchema.pre("save", async function(next){
        if(!this.isModified('password'))  return next()

            try {
                this.password= await bcrypt.hash(this.password, 10)
            } catch (error) {
                next(error)
            }
    })

 const Doctor= mongoose.model('Doctor', doctorSchema)

 export default Doctor