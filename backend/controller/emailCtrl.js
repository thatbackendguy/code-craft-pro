const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendEmail = asyncHandler(async (data, req, res)=>{
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });
    

      let info = await transporter.sendMail({
        from: '"CodeCraftPro. 👨🏻‍💻" <pipinstallgeeks@gmail.com>',
        to: data.to,
        subject: data.subject, 
        text: data.text,
        html: data.htm,
      });
    
      console.log("Message sent: %s", info.messageId);
});

module.exports = { sendEmail };