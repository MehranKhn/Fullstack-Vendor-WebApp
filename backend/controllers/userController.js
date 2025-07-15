const User= require('../db/User');

const userController={
    updateProfile: async (req,res)=>{
        try{
                const user= await User.findByIdAndUpdate(req.id,req.body,{new:true});
                if(!user){
                     return res.status(404).json({ msg: "User not found" });
                }
                res.status(200).json({
                    msg:"Updation done",
                    user
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
module.exports=userController;