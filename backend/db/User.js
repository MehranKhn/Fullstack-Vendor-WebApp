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
        trim:true
    },
    password:{
        type:String,
    },
    role:{
        type:String,
        enum:['user','vendor','admin'],
        default:'user'
    },
   provider:{
        type:String,
        enum:['local','google','facebook'],
        default:'local'
    },
    providerId:{
        type:String
    }
},{timestamps:true});

userSchema.index({email:1,providers:1},{unique:true});
//Schema MiddleWare for hashing The password
userSchema.pre('save',async function(next){
    if(this.provider!=='local') return next();

    if(!this.isModified('password')) return next();

    this.password=await bcrypt.hash(this.password,12);
    next();
});
userSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

const User=mongoose.model('User',userSchema);
module.exports=User;