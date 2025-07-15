const express=require('express');
const passport=require('passport')
const mongoose=require('mongoose');
const app=express();
const cors = require('cors');

require('dotenv').config();
require('./config/passport')


const mainRouter=require('./routes');
const PORT=process.env.PORT || 3000
const MONGO_URL=process.env.MONGO_URL;
app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

app.use('/api/v1',mainRouter)

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log('Server running'));
  })
  .catch(err => console.error(err));