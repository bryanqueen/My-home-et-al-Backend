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


    
const sendVerificationEmail = async (email, otp) => {
    
    // Read the HTML template
    const templatePath = path.join(__dirname, 'OtpVerification.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    // Replace the placeholder with the actual OTP
    html = html.replace('{{otp}}', otp);

    console.log(`Sending OTP: ${otp} to ${email}`)

    //Send mail
    await transporter.sendMail({
        from: '"My Home etal" <mailtrap@demomailtrap.com>',
        to: email,
        subject: 'OTP to verify your email address',
        html
        
    });
    
}
module.exports = sendVerificationEmail;
