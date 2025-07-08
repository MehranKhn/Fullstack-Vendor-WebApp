const mongoose=require('mongoose')
const bcrypt=require('bcrypt')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['user','vendor','admin'],
        default:'user'
    }
},{timestamps:true});

//Schema MiddleWare for hashing The password
userSchema.pre('save',async(next)=>{
    if(!this.isModified('password')) return next();
    this.password=await bcrypt.hash(this.password,12);
    next();
});

const User=mongoose.model('User',userSchema);
module.exports=User;