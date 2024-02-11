const { default: mongoose } = require("mongoose")

const dbConnect = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.DB_URI)
        console.log("Database connnected successfully!");
    } catch (error) {
        console.log("Database connection error!");
    }
}

module.exports = dbConnect;