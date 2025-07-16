const express=require('express');
const vendorRouter=express.Router();
const authMiddleware=require("../middlewares/authMiddleware")
const roleMiddleware=require("../middlewares/roleMiddleware")
const vendorController=require('../controllers/vendorController');

vendorRouter.get('/vendors',authMiddleware,vendorController.search);

vendorRouter.post('/addItem',authMiddleware,roleMiddleware,vendorController.addProduct);

vendorRouter.get('/:vendorId/profile',authMiddleware,vendorController.getVendorProfile);


vendorRouter.get('/me/cards',authMiddleware,roleMiddleware,vendorController.getVendorCards);

vendorRouter.get('/:vendorId/cards',authMiddleware,vendorController.getVendorCards);

vendorRouter.put('/update/card/:cardId',authMiddleware,roleMiddleware,vendorController.editVendorCard);

vendorRouter.delete('/delete/card/:cardId',authMiddleware,roleMiddleware,vendorController.deleteCard)

module.exports=vendorRouter;