const express=require('express');
const app=express();
const cors = require('cors');
require('dotenv').config();

const mainRouter=require('./routes');
const PORT=process.env.PORT || 3000

app.use(express.json());
app.use(cors());

app.use('/api/v1',mainRouter)

app.listen(PORT,()=>{
    console.log("Server is up and Running!");
})