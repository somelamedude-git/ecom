const { Tag } = require('./src/models/tags.model');
const { DB_NAME } = require('./src/constants');
const { default: mongoose } = require('mongoose');
require('dotenv').config({ path: './.env' });

const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {
        });
        console.log(conn);
    } catch(error){
        console.error(error);
        throw error;
    }
}

const addTags = async(tagnames = [])=>{
    let tag_docs = [];

    for(let i =0; i<tagnames.length; i++){
        tag_docs.push({
            name:tagnames[i],
            index: i
        })
    }

    try{
        await connectDB();
        await Tag.insertMany(tag_docs);
        console.log('Tags added successfully');
    } catch(error){
        console.log(error);
    } finally{
        await mongoose.disconnect();
    }
}

const tagnames  = [
  "T-Shirts", "Hoodies", "Dresses", "Jeans", "Shorts", "Skirts", "Co-ords", "Oversized", "Crop Tops", "Jackets",
  "Blazers", "Suits", "Loungewear", "Ethnic Wear", "Sarees", "Kurtis", "Leggings", "Tracksuits", "Streetwear", "Activewear",
  "Athleisure", "Formal Wear", "Casual Wear", "Winter Wear", "Summer Wear", "Layered Looks", "Minimalist", "Vintage", "Sustainable", "Unisex",
  
  "Lipstick", "Lip Gloss", "Lip Balm", "Foundation", "Concealer", "BB Cream", "Highlighter", "Bronzer", "Blush", "Primer",
  "Eyeshadow", "Mascara", "Eyeliner", "Brow Gel", "Brow Pencil", "Makeup Remover", "Setting Spray", "Loose Powder", "Compact", "Color Corrector",
  "Vegan Makeup", "Cruelty-Free", "Long Lasting", "Matte Finish", "Dewy Finish",

  "Bold Look", "Everyday Essentials", "Glam Night", "Workwear", "Party Ready", "Brunch Outfits", "Monochrome", "Boho", "Edgy", "Chic",
  "Street Style", "Minimalist", "Retro", "Preppy", "Elegant", "Grunge", "Cute & Flirty", "Urban", "Luxe", "Statement Pieces",

  "Summer Collection", "Winter Collection", "Spring Vibes", "Fall Looks", "Diwali Specials", "Wedding Guest", "Vacation Essentials", "Festive Wear", "Rainwear", "Date Night",
  "College Fit", "Beachwear", "New Year Glam", "Back to School", "Valentine's Drop",

  "For Him", "For Her", "For Kids", "Gender Neutral", "All Skin Types", "Oily Skin", "Dry Skin", "Sensitive Skin", "Dark Skin Friendly", "Fair Skin Friendly"
];

addTags(tagnames);
