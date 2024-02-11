// for CORS
const helmet = require("helmet")
const cors = require("cors")

//importing libraries
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require("dotenv").config()
const cookieParser = require("cookie-parser");

//importing middlewares
const dbConnect = require('./config/dbConnect');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const userRoute = require("./routes/userRoute");

const app = express();
const PORT = process.env.PORT || 3000;

// for CORS
app.use(helmet())
app.use(cors({ origin: '*' }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/api/user',userRoute)

app.get('/',(req,res)=>{
    res.json({
        message: "Welcome to CodeCraftPro APIs",
        "developed-by":"https://yashpra1010.github.io/"
    })
})
app.use(notFound);
app.use(errorHandler);

dbConnect().then(()=>{
    app.listen(PORT, () => console.log('Server is running at port: '+ PORT));
});