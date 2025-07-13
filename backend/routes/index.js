const express=require('express');
const router=express.Router();

const authRouter=require('./authRoute');
const reviewRouter=require('./reviewRoute');
const userRouter=require('./userRoute');
const vendorRouter=require('./vendorRoute');

router.use('/auth',authRouter);
router.use('/review',reviewRouter);
router.use('/user',userRouter);
router.use('/vendor',vendorRouter);

module.exports=router;
