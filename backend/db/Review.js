const mongoose=require('mongoose')

const reviewSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    vendorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    cardId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'vendorCard',
        required:true
    },
    ratings:{
        type:Number,
        min:1,
        max:5
    },
    comment:{
        type:String,
        trim:true
    }
},{timestamps:true})

const Review=mongoose.model(Review,reviewSchema);
module.exports=Review;