const express=require('express')
const authRouter=express.Router();
const passport=require('passport');
const authController=require('../controllers/authController');
const jwt=require('jsonwebtoken');
const JWT_SECRET=process.env.JWT_SECRET;
authRouter.post('/signup',authController.signup);

authRouter.post('/login',authController.login);

authRouter.get('/google',
    passport.authenticate('google',{scope:['profile','email']})
);
authRouter.get('/login', (req, res) => {
    res.status(401).json({
        success: false,
        msg: "OAuth login failed. Please try again."
    });
});

authRouter.get('/google/callback',
    passport.authenticate('google',{
        failureRedirect: '/login',
        session: false
    }),
    (req,res)=>{
        const user=req.user;
        const token=jwt.sign({
            id:user._id,
            email:user.email,
            role:user.role
        },JWT_SECRET,{expiresIn:'15m'});

        res.status(200).json({
            msg:"User created succesFully",
            token:`Bearer ${token}`
        })
    }
)

//facebook Oauth routes

authRouter.get('/facebook',
    passport.authenticate('facebook',{scope:['email']})
);

authRouter.get('/facebook/callback',
    passport.authenticate('facebook',{
        failureRedirect:'`http://localhost:3000/login?error=true',
        session:false
    }),
    (req,res)=>{
         const user=req.user;
        const token=jwt.sign({
            id:user._id,
            email:user.email,
            role:user.role
        },JWT_SECRET,{expiresIn:'15m'});

        res.status(200).json({
            msg:"User created succesFully",
            token:`Bearer ${token}`
        })
    }
)
module.exports=authRouter;