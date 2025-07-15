const express=require('express');
const userRouter=express.Router()
const userController=require('../controllers/userController')
const cartController=require('../controllers/cartController')

userRouter.post('/updateProfile',userController.updateProfile)
userRouter.post('/addItem',cartController.addItem);

module.exports=userRouter;