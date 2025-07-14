const User=require('../db/User');
const zod=require('zod');
const jwt=require('jsonwebtoken');
const JWT_SECRET=process.env.JWT_SECRET;
const crypto=require('crypto')
const sendEmail=require('../config/nodemailer');

const signUpSchema=zod.object({
    name:zod.string(),

    email:zod.string().email("Invalid email address").trim().toLowerCase(),

    password:zod.string().min(6,"Password must be 6 characters long").max(12,"Password cannot exceed 12 characters")
})

const authController={
    signup: async (req,res)=>{
           const result=signUpSchema.safeParse(req.body);
           if(!result.success){
            return res.status(400).json({
                msg:result.error.errors
            });
           }
           const {name,email,password,role}=req.body
           try{

               const userExists=await User.findOne({email,provider:'local'});
               if(userExists){
                  return res.status(400).json({
                    msg:"User already exists"
                  })
               }
               const user=await User.create({name,email,password,role});
               const token=jwt.sign({id:user._id,email:user.email,role:user.role}, JWT_SECRET,{expiresIn:'15m'});

                  res.status(200).json({
                    msg:"User created Successfully",
                    token:`Bearer ${token}`
               })

           }
           catch(e){
             console.log(e);
             return res.status(500).json({
                msg:"Something went wrong!"
            })
           }
        },
    login:async(req,res)=>{
         const {email,password}=req.body;
         try{

             const userExists=await User.findOne({email});
             if(!userExists){
                return res.status(400).json({
                    msg:"User doesn't exist!"
                });
             }
             const isMatched=await userExists.matchPassword(password);
             if(!isMatched){
                return res.status(400).json({
                    msg:"Incorrect Password"
                });
             }
             const token=jwt.sign({id:userExists._id,email,role:userExists.role},JWT_SECRET,{expiresIn:'15m'});

             res.status(200).json({
                msg:"SuccessFully logged In",
                token:`Bearer ${token}`
             })
         }
         catch(e){
            console.log(e);
            return res.status(500).json({
                msg:"Something went wrong"
            })
         }
    },
    me: async(req,res)=>{
        try{
            const user= await User.findById(req.id).select('-password');
            if(!user){
                return res.status(404).json({
                    msg:"User Not found, please signup"
                })
            }
            res.status(200).json({
                user
            })
        }
        catch(e){
            console.log(e);
            return res.status(500).json({
                msg:"Something went wrong!"
            })
        }
    },
   forget_Password: async(req,res)=>{
     const email=req.body?.email.toLowerCase();
     try{
         const user=await User.findOne({email,provider:'local'});
         if(!user){
            return res.status(404).json({
                msg:"No User Found"
            })
         }
         const resetToken=crypto.randomBytes(32).toString('hex');
         user.resetPasswordToken=resetToken;
         user.resetPasswordExpires=Date.now()+(10*60*1000);
         await user.save();
         
         const resetLink=`http://localhost:3000/api/v1/auth/reset_Password?token=${resetToken}&email=${encodeURIComponent(email)}`;

         await sendEmail(
            email,
            "Password Reset Request",
            `
             <p>Hello ${user.name},</p>
             <p>You requested to reset your password. Click the link below to reset it:</p>
             <a href="${resetLink}">Reset Password</a>
             <p>This link will expire in 10 minutes.</p>
            `
         )

         res.status(200).json({
            msg:"If a user with that email exists, a reset link has been sent"
         })
        }
       catch(e){
        console.log(e);
        return res.status(500).json({
            msg:"Something went wrong!"
        })
       }

   },
   reset_Password: async(req,res)=>{
    const {email,token,newPassword}=req.body;
        try{
           const user=await User.findOne({email,provider:'local'});
           if(!user || !user.resetPasswordToken || !user.resetPasswordExpires || user.resetPasswordExpires < Date.now()){
            return res.status(404).json({
                msg:"Inavlid or expired reset token"
            })
           }
           const isMatched=await user.matchResetTokens(token);
           if(!isMatched){
               return res.status(404).json({
                msg:"Inavlid or expired reset token"
               })
           }
        
        user.password=newPassword;
        user.resetPasswordToken="";
        user.resetPasswordExpires=null
        await user.save();
        return res.status(200).json({ msg: "Password reset successfully" });
        }
        catch(e){
            console.log(e);
            return res.status(500).json({
                msg:"Something went wrong!"
            })
        }
   }
}
module.exports=authController;
