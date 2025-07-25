const Cart=require('../db/Cart');

const cartController={
    addItem: async(req,res)=>{
        const priceAtTime=req.body.priceAtTime;
        const vendorCardId=req.params.vendorCardId;
        const userId=req.user.id;
        try{
           let cart=await Cart.findOne({userId});
            if(!cart){
                cart=await Cart.create({userId,products:[{vendorCardId,quantity:1,priceAtTime}]});
                return res.status(200).json({
                    msg:"Item added to the Cart"
                })
            }
            const product=cart.products.find(product=>product.vendorCardId.toString()==vendorCardId);
            if(product){
                product.quantity+=1;
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
    },
    incQuantity: async(req,res)=>{
       const vendorCardId=req.params.vendorCardId;
        const userId=req.user.id;
        try{
            const cart=await Cart.findOne({userId});
            const product= cart.products.find(product=>product.vendorCardId.toString()==vendorCardId);
            product.quantity+=1
            await cart.save();
            res.status(200).json({
                msg:"Incremented the quantity By 1"
            })
        }
        catch(e){
            console.log(e);
            res.status(500).json({
                msg:"Something went wrong"
            })
        }
    },
    decQuantity: async(req,res)=>{
        const vendorCardId=req.params.vendorCardId;
        const userId=req.user.id;
        try{
            const cart=await Cart.findOne({userId});
            const product= cart.products.find(product=>product.vendorCardId.toString()==vendorCardId);
            
            if(product.quantity>1){
                product.quantity-=1
            }
            await cart.save();
            res.status(200).json({
                msg:"decremented the quantity By 1"
            })
        }
        catch(e){
            console.log(e);
            res.status(500).json({
                msg:"Something went wrong"
            })
        }
    },
    deleteItem: async(req,res)=>{
        const userId=req.user.id;
        const vendorCardId=req.params.vendorCardId;
        try{
            const updatedCart=await Cart.findOneAndUpdate({userId},{$pull:{products:{vendorCardId:vendorCardId}}},{new:true,runValidators:true});
            res.status(200).json({
                msg:"Removed Succesfully",
                updatedCart
            })
        }
        catch(e){
            console.log(e);
            res.status(500).json({
                msg:"Something went wrong"
            })
        }
    },
    getItems:async(req,res)=>{
        const userId=req.user.id
        try{
            const cart=await Cart.findOne({userId}).populate('products.vendorCardId');
            if(!cart){
                return res.status(404).json({
                    msg:"No Cart found"
                })
            }
            res.status(200).json({
                msg: "Cart fetched successfully",
                cart: cart.products
            });

        }
        catch (e) {
            console.log(e);
            res.status(500).json({ msg: "Something went wrong" });
       }
    }
}
module.exports=cartController;