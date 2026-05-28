
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

const uploadOnCloudinary = async (localFilePath) => {

    cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

    try {
       if(!localFilePath) return null
        //if filepath available here then upload it on the cloudinary 
        const response= await cloudinary.uploader.upload(localFilePath, {
            resource_type:'auto'
        })
        console.log('file uploaded on the cloudinary: ', response.url)
        fs.unlinkSync(localFilePath)
        // console.log(response)
        return response
        
    } catch (error) {
        console.log('cloudinary error: ', error)
        fs.unlinkSync(localFilePath)   // it removes the locally saved file as the upload operation 
        return null

    }
}



// Function to delete an image from Cloudinary if database registration fails
const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null;
        
        // Destroy the file using its unique public ID
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Garbage image removed from Cloudinary:", result);
        return result;
    } catch (error) {
        console.log("Error while deleting from Cloudinary:", error);
        return null;
    }
};
export {uploadOnCloudinary, deleteFromCloudinary}
