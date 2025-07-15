const mongoose=require('mongoose');

const cartSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    products:[
       { 
        vendorCardId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'vendorCard',
            required:true
        },
        quantity:{type:Number,default:1},
        priceAtTime:{type:Number}
       }
    ]
},{timestamps:true});
const Cart=mongoose.model('Cart',cartSchema);
module.exports=Cart;