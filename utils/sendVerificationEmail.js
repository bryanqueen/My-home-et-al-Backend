const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path')
const transporter = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD,
    },
    });


    
const sendVerificationEmail = async (email, otp, firstname) => {
    
    // Read the HTML template
    const templatePath = path.join(__dirname, 'OtpVerification.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    // Replace the placeholder with the actual OTP
    html = html.replace('{{otp}}', otp);
    html = html.replace('{{name}}', firstname)

    console.log(`Sending OTP: ${otp} to ${firstname}`)

    //Send mail
    await transporter.sendMail({
        from: 'My home et al verify@myhomeetal.com',
        to: email,
        subject: 'OTP to verify your email address',
        html
        
    });
    
}
module.exports = sendVerificationEmail;
