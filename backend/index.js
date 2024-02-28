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
const editorRoute = require("./routes/editorRoute");

const app = express();
const PORT = process.env.PORT || 3001;

// for CORS
app.use(helmet())
app.use(cors({ origin: '*' }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/api/user',userRoute)
app.use('/api',editorRoute)

app.get('/',(req,res)=>{
    res.json({
        message: "Welcome to CodeCraftPro APIs",
        docs: "https://github.com/yashpra1010/code-craft-pro/"
    })
})
app.use(notFound);
app.use(errorHandler);

// for socket.io
const http = require("http");
const { Server } = require("socket.io");
const { log } = require("console");
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET","POST","PUT","DELETE"],
    },
})

io.on("connection", (socket)=> {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_common_file",(data) => {
        socket.join(data)
    })

    socket.on("send_user_code",(data)=>{
        // console.log(data)
        socket.to(data.fileID).emit("receive_user_code",data)
    })
})

dbConnect().then(()=>{
    server.listen(PORT, () => console.log('Server is running at port: '+ PORT));
});

// for new deployment