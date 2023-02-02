const mongoose = require("mongoose");

const addToCartSchema = new mongoose.Schema(
    {
        title:{type: String, required:true,unique:true},
        description:{type:String},
        price:{type:String},
        image:{type:String},
        quantity:{type: String},

        isAdmin:{
            type:Boolean, default:false,
        },
    },{timestamps: true});

    module.exports = mongoose.model('AddToCart',addToCartSchema)