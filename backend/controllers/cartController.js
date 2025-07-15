const Cart=require('../db/Cart');

const cartController={
    addItem: async(req,res)=>{
        const {vendorCardId,priceAtTime}=req.body;
        const userId=req.id;
        try{
           let cart=await Cart.findOne({userId});
            if(!cart){
                cart=await Cart.create({userId,products:[{vendorCardId,quantity:1,priceAtTime}]});
                return res.status(200).json({
                    msg:"Item added to the Cart"
                })
            }
            const product=cart.products.find(product=>product.vendorCardId==vendorCardId);
            if(product){
                product?.quantity+=1;
            }
            else{
                cart.products.push({vendorCardId,quantity:1,priceAtTime});
            }
            await cart.save();
            return res.status(200).json({
                msg:"Item Added to the cart"
            })
        }
        catch(e){
            console.log(e);
            return res.status(500).json({
                msg:"Something went wrong"
            })
        }
    }
}
module.exports=cartController;