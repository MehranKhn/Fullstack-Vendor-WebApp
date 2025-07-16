const mongoose=require('mongoose');

const vendorCardSchema=new mongoose.Schema({
    vendorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        default:0
    },
    location:{
        type:String,
        required:true,
        trim:true
    },
    category:{
        type:String,
        trim:true
    },
    images:[
        {
            type:String
        }
    ]
}, {timestamps:true});

const vendorCard=mongoose.model('vendorCard',vendorCardSchema);
vendorCardSchema.index({category:$text,location:$text})
module.exports=vendorCard;