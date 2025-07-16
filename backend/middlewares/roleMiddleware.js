function roleMiddleware(req,res,next){
   if(req.user.role=="vendor"){
    return next();
   }
   return res.status(404).json({
    msg:"Not Authorized for this Action"
   })
}
module.exports=roleMiddleware;