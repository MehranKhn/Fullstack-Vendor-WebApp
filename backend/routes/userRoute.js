const express=require('express');
const userRouter=express.Router()
const userController=require('../controllers/userController')
const cartController=require('../controllers/cartController')
const authMiddleware=require('../middlewares/authMiddleware');

userRouter.post('/updateProfile',authMiddleware,userController.updateProfile)
userRouter.post('/addItem',authMiddleware,cartController.addItem);

module.exports=userRouter;