const User=require('../db/User');
const zod=require('zod');
const jwt=require('jsonwebtoken');
const JWT_SECRET=process.env.JWT_SECRET;
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

               const userExists=await User.findOne({email});
               if(userExists){
                  return res.status(400).json({
                    msg:"User already exists"
                  })
               }
               const user=await User.create({name,email,password,role});
               const token=jwt.sign({id:user._id,email,role}, JWT_SECRET,{expiresIn:'15m'});

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
    }
}
module.exports=authController;
