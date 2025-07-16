const express=require('express');
const userRouter=express.Router()
const userController=require('../controllers/userController')
const cartController=require('../controllers/cartController')
const authMiddleware=require('../middlewares/authMiddleware');

userRouter.put('/updateProfile',authMiddleware,userController.updateProfile)
userRouter.post('/addItem',authMiddleware,cartController.addItem);
userRouter.post('/Inc',cartController.incQuantity)
userRouter.post('/dec',cartController.decQuantity)
userRouter.get('/getItems',cartController.getItems)

module.exports=userRouter;