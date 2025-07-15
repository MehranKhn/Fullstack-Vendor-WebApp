const User=require('../db/User');

const vendorController=
 {
    search: async(req,res)=>{
        const filter=req.body.filter ||"";
        try{
            let query={}

            if(filter){
                query={
                    name:{$regex:filter,$options:'i'},
                    role:'vendor'
                }
                const users=await User.find(query).select('name email avatar role');

                   return res.status(200).json({
                       users
                   })
                }
                else{
                    res.status(200).json({
                        users:[]
                    })
                }
            }
            catch(e){
                console.log(e);
                return res.status(500).json({
                    msg:"Something went wrong"
                })
            }
        }
    }
    module.exports=vendorController