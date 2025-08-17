const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: '../.env' });
const fs = require('fs');

const uploadOnCloudinary = async(localFilePath)=>{
    console.log('inside uploadOnCloud', localFilePath);
console.log("Cloudinary's settings:");
    cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET});
  console.log({
  cloud_name: cloudinary.config().cloud_name,
  api_key: cloudinary.config().api_key ? "loaded" : "missing",
  api_secret: cloudinary.config().api_secret ? "loaded" : "missing",
});
    try{
          if(!localFilePath){
            console.log('what is even happening');
            return null;
          };
    const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto"
    });
    console.log(response, 'I am guaging cloud response, help')
    fs.unlinkSync(localFilePath); //We have to keep our laptops from exploding
    return response;
    } catch(error){
        console.log(error, 'Inside the cloud')
        fs.unlinkSync(localFilePath);
        return null;
    }
}

module.exports = {
    uploadOnCloudinary
}

