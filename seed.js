const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const { Product } = require('./src/models/product.models');
require('dotenv').config({path: './env'});

const seedProducts = async(count=10){
    const products = [];

    for(let i =0; i<count; i++){
        products.push({
            description: faker.commerce.productDescription(),
            name: faker.commerce.productName(),
            productImages:faker.image.urlPicsumPhotos(), // Don't focus on the name, it's a single image
            
        })
    }
}
