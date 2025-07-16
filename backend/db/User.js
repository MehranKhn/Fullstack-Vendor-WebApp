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
        trim:true,
        lowercase:true
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
    },
    avatar:{
       type:String,
       default:'/default-avatar.png'
    },
    // location:{
    //    type:{
    //     type:String,
    //     enum:['Point'],
    //     default:'Point'
    //    },
    //    coordinates:{
    //     type:[Number],//longitude and latitude
    //    },
    //    address:{
    //     type:String,
    //    }
    // },
    bio:{
        type:String,
        trim:true
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordExpires:{
        type:Date
    }
},{timestamps:true});

userSchema.index({email:1,provider:1},{unique:true});
// userSchema.index({location:'2dsphere'});
// Schema MiddleWare for hashing The password
userSchema.pre('save',async function(next){
    if(this.provider!=='local') return next();

    if(this.isModified('password')){

        this.password=await bcrypt.hash(this.password,12);
    }

    //if the resetPasswordToken exists
    if(this.isModified('resetPasswordToken') && this.resetPasswordToken){
        this.resetPasswordToken=await bcrypt.hash(this.resetPasswordToken,12);
    }
    next();
});

userSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

userSchema.methods.matchResetTokens=async function(resetToken){
    return await bcrypt.compare(resetToken,this.resetPasswordToken);
}
const User=mongoose.model('User',userSchema);
module.exports=User;