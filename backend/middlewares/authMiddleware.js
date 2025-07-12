const jwt=require('jsonwebtoken');

function authMiddleware(req,res,next){
   const authHeader=req.headers.authorization;

   if(!authHeader || !authHeader.startsWith('<Bearer> ')){
    return res.status(401).json({
        msg:"Token not present"
    })
   }

   const token=authHeader.split(' ')[1];
    try{
        const payload=jwt.verify(token,process.env.JWT_SECRET);
        if(!payload.id){
          return res.status(401).json({
            msg:"Tampered token"
          })
        }
        req.user=payload;
        next();
    }
    catch(e){
         res.status(401).json({
            msg:"Inavlid or expired token"
         })
    }
}
module.exports=authMiddleware;