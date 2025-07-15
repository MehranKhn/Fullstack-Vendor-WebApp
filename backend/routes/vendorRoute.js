const express=require('express');
const vendorRouter=express.Router();
const vendorController=require('../controllers/vendorController')

vendorRouter.get('/vendors',vendorController.search);

module.exports=vendorRouter;