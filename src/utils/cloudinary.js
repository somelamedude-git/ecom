const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: '../.env' });
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET
});

const uploadOnCloudinary = async(localFilePath)=>{
    try{
          if(!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto"
    });
    fs.unlinkSync(localFilePath); //We have to keep our laptops from exploding
    return response;
    } catch(error){
        fs.unlinkSync(localFilePath);
        return null;
    }
}

module.exports = {
    uploadOnCloudinary
}

