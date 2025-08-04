const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const { Product } = require('./src/models/product.models');
require('dotenv').config({path: './env'});
const { Category } = require('./src/models/category.models');

const seedProducts = async(count=10){
    const products = [];
    const categories = await Category.find();

    for(let i =0; i<count; i++){
        const category = faker.helpers.arrayElement(categories)._id;
        products.push({
            description: faker.commerce.productDescription(),
            name: faker.commerce.productName(),
            productImages:faker.image.urlPicsumPhotos(), // Don't focus on the name, it's a single image
            views: 0,
            reviews: [],
            popularity: 0,
            tags: [1,2,3],
            
            
        })
    }
}
