const User=require('../db/User');
const Review=require('../db/Review')
const reviewController={
    postReview:async(req,res)=>{
        const userId=req.user.id;
        const vendorId=req.params.vendorId;
    
        try{
            const review= await Review.create({userId,vendorId,cardId,...req.body});
            return res.status(200).json({
                msg:"Review Added",
                review
            });
        }
        catch(e){
            console.log(e);
            return res.status(500).json({
                msg:"Something went wrong"
            })
        }
    },
    getReviews: async(req,res)=>{
        const vendorId=req.params.vendorId;
        try{
            const vendorReviews=await Review.aggregate([
                {
                $match:{vendorId:new mongoose.Types.ObjectId(vendorId)},
                },
                {
                    $group:{
                        _id:"$cardId",
                        averageRatings:{$avg:"$ratings"},
                        comments:{
                            $push:  {text:"$comment",userId:"$userId"}
                                },
                        count:{$sum:1}
                    }
                }
              ])
              res.status(200).json({
                msg:"Ratings fetched Successfully",
                vendorReviews
              })
            }
            catch(e){
                console.log(e)
                return res.status(500).json({
                    msg:"Something went wrong"
                })
            }
        }
    }
module.exports=reviewController