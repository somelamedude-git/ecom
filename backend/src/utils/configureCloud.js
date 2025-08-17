const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: '../.env' });

const configure = ()=>{
    cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET
});

  console.log({
  cloud_name: cloudinary.config().cloud_name,
  api_key: cloudinary.config().api_key ? "loaded" : "missing",
  api_secret: cloudinary.config().api_secret ? "loaded" : "missing",
});
}

configure();