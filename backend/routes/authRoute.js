const express=require('express')
const authRouter=express.Router();
const passport=require('passport');
const authController=require('../controllers/authController');
const jwt=require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
const JWT_SECRET=process.env.JWT_SECRET;
authRouter.post('/signup',authController.signup);

authRouter.post('/login',authController.login);

authRouter.get('/me',authMiddleware,authController.me);

authRouter.post('/forget-password',authController.forget_Password);

authRouter.post('/reset-password',authController.reset_Password);
//OAUth Routes for google-oauth and facebook-oauth

authRouter.get('/login', (req, res) => {  // This route will be removed when frontend is made
    res.status(401).json({
        success: false,
        msg: "OAuth login failed. Please try again."
    });
});

authRouter.get('/google',(req,res,next)=>{
    const role=req.query.role;
    passport.authenticate('google',{
        scope:['profile','email'],
        state:role
    })(req,res,next)
 }
 );

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

authRouter.get('/facebook',(req,res,next)=>{
    const role=req.query.role;
    passport.authenticate('facebook',{
        scope:['email'],
        state:role
    })(req,res,next);
});

authRouter.get('/facebook/callback',    
    passport.authenticate('facebook',{
        failureRedirect:'/api/v1/auth/login?error=true',
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
            msg:"User logged in Successfully",
            token:`Bearer ${token}`
        })
    }
)
module.exports=authRouter;