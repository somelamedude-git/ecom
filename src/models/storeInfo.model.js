const mongoose = require('mongoose');

const storeInfoSchema = new mongoose.Schema({
    address :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    },

    store_owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BaseUser"
    }
}, {timestamps:true})

const Store = mongoose.model("Store", storeInfoSchema)