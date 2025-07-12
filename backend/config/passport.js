const passport=require('passport');
const googleStrategy=require('passport-google-oauth20').Strategy;
const User=require('../db/User')

passport.use(new googleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:'/auth/google/callback'
  },
   async(accessToken,refreshToken,profile,done)=>{
      const email= profile.emails?.[0]?.value;
        try{
            let user=await User.findOne({email,provider:'google'});
            if(!user){
              user= await User.create({
                name:profile.displayName,
                providerId:profile.id,
                email,
                provider:google
               });
            }
            done(null,user);
        }
        catch(e){
            console.log(e);
            done(e,false);
        }
   }
))