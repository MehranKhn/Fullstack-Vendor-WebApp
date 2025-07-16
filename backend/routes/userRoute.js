const express=require('express');
const userRouter=express.Router()
const userController=require('../controllers/userController')
const cartController=require('../controllers/cartController')
const authMiddleware=require('../middlewares/authMiddleware');

userRouter.post('/updateProfile',authMiddleware,userController.updateProfile)
userRouter.post('/addItem/:vendorCardId',authMiddleware,cartController.addItem);
userRouter.post('/Inc/:vendorCardId',authMiddleware,cartController.incQuantity)
userRouter.post('/dec',authMiddleware,cartController.decQuantity)
userRouter.get('/getItems',authMiddleware,cartController.getItems)
userRouter.delete('/deleteItem/:vendorCardId',authMiddleware,cartController.deleteItem);

module.exports=userRouter;