const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendEmail = asyncHandler(async (data, req, res)=>{
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"CodeCraftPro. 👨🏻‍💻" <pipinstallgeeks@gmail.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.htm, // html body
      });
    
      console.log("Message sent: %s", info.messageId);
});

module.exports = { sendEmail };