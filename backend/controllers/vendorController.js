const { default: mongoose } = require('mongoose');
const User=require('../db/User');
const vendorCard = require('../db/vendorCard');
const vendorController=
 {
    search: async(req,res)=>{ //for advanced searching we can create a separte seraching collection
        const filter=req.body.filter ||"";
        try{
            if(filter){
               const userQuery={
                $text:{$search:filter},role:'vendor'  
            };
            //$text-->text index-->builds  a special inverted index resulting very fast and relevant searching

               const cardQuery={
                 $text:{$search:filter}
                };

                const [vendors,cards]=await Promise.all([
                    User.find(userQuery).select('name email avatar role'),
                    vendorCard.find(cardQuery).select('-_id')
                ]);

                   return res.status(200).json({
                       vendors,
                       cards
                   })
                }
                else{
                    res.status(200).json({
                        vendors:[],
                        cards:[]
                    })
                }
            }
            catch(e){
                console.log(e);
                return res.status(500).json({
                    msg:"Something went wrong"
                })
            }
        },
        addProduct:async(req,res)=>{
                const vendorId=req.user.id;
                try{
                        const card=await vendorCard.create({vendorId,...req.body});
                        return res.status(200).json({
                            msg:"Successfully added the product/service",
                            card
                        })
                    }
                    catch(e){
                     console.log(e);
                     res.status(500).json({
                         msg:"Something went wrong",
                     })
                 }
            },
             getVendorProfile:async (req,res)=>{
                const vendorId=req.params.vendorId || req.user.id;
                try{
                    const vendor=await User.findOne({vendorId}).select('-password,-resetPasswordToken');
                    res.status(200).json({
                        msg:"Vendor Profile Fetched Successfully",
                        vendor
                    })
                }
                catch(e){
                    console.log(e);
                    res.status(500).json({
                        msg:"Something went Wrong"
                    })
                }
             },
             getVendorCards: async(req,res)=>{
                const vendorId=req.params.vendorId || req.user.id
                try{

                    const cards=await vendorCard.find({vendorId});
                    res.status(200).json({
                        msg:"Fetched all vendor cards",
                        cards
                    })
                 }
                 catch(e){
                    console.log(e);
                    res.status(500).json({
                        msg:"Something went Wrong"
                    })
                }
            },
            editVendorCard:async(req,res)=>{
                  const cardId=req.params.id;
                  const vendorId=req.user.id;
                  if(!mongoose.Types.ObjectId.isValid(cardId)){
                    res.status(404).json({
                        msg:"Inavalid Card Id"
                    })
                  }
                  try{
                    const card=await vendorCard.findOneAndUpdate({_id:cardId,vendorId},{$set:req.body},{new:true,runValidators:true});
                    if (!card) {
                        return res.status(404).json({
                            msg: "Card not found"
                        });
                    }
                    res.status(200).json({
                        msg:"Updated succesfully",
                        card
                    });
                  }
                  catch(e){
                    console.log(e);
                    res.status(500).json({
                        msg:"Something went Wrong"
                    })
                  }
            },
            deleteCard:async(req,res)=>{
                  const vendorId=req.user.id;
                  const cardId=req.params.id;
                  if(!mongoose.Types.ObjectId.isValid(cardId)){
                    return res.status(404).json({
                        msg:"Invalid Card id"
                    })
                  }
                  try{
                    const deletedCard=await vendorCard.findOneAndDelete({vendorId,_id:cardId});
                    res.status(200).json({
                        msg:"Successfully deleted the Card",
                        deletedCard
                    });
                  }
                  catch(e){
                    console.log(e);
                    res.status(500).json({
                        msg:"Something went Wrong"
                    })
                  }
            }
         }


    module.exports=vendorController