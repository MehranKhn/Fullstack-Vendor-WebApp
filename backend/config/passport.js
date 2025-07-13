const passport=require('passport');
const googleStrategy=require('passport-google-oauth20').Strategy;
const facebookStrategy=require('passport-facebook').Strategy
const User=require('../db/User')

//Google configuration
passport.use(new googleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:'/api/v1/auth/google/callback'
  },
   async(accessToken,refreshToken,profile,done)=>{
      const email= profile.emails?.[0]?.value;
        try{
            let user=await User.findOne({providerId:profile.id,provider:'google'});
            if(!user){
              user= await User.create({
                name:profile.displayName,
                providerId:profile.id,
                email,
                provider:'google'
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

//Facebook Configration

passport.use(new facebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: '/api/v1/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name', 'displayName']
}, async(accessToken,refreshToken,profile,done)=>{
     try{
      let user=await User.findOne({
        $or:[
           {providerId:profile.id,provider:'facebook'},
           {email:profile.emails?.[0].value,provider:'facebook'}
        ]
      })
      if(!user){
        user=await User.create({
          name:profile.displayName,
          email:profile.emails?.[0].value,
          providerId:profile.id,
          provider:'facebook'
        })
      }
      done(null,user);
     }
     catch(e){
      done(e,false)
     }
}))