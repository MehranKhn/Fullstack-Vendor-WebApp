const express=require('express');
const reviewRouter=express.Router();
const reviewController=require('../controllers/reviewController');
const authMiddleware=require('../middlewares/authMiddleware')

reviewRouter.post('/reviews/:vendorId',authMiddleware,reviewController.postReview);

reviewRouter.get('/reviews/:vendorId',authMiddleware,reviewController.getReviews);

module.exports=reviewRouter;