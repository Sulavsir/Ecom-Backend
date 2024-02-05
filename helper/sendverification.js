const crypto = require('crypto');
const nodemailer = require('nodemailer');
// Generate a verification token
const generateRandomToken = (length) => {
    return crypto.randomBytes(length).toString('hex');
  };
  
  // Generate a verification token
  const generateVerificationToken = () => {
    const tokenLength = 32;
    return generateRandomToken(tokenLength);
  };
  
  // Simulated function to send verification email using Nodemailer
  const sendVerificationEmail = async (email, verificationLink) => {
    try {
      // Create a transporter using SMTP transport
      
      const transporter = nodemailer.createTransport({
          host: 'smtpout.secureserver.net',
         port: 465,
        secure: true,
        auth: {
          user: 'info@koseli.app', // Your Gmail email address
          pass: '+ujL=tHGt9%Hq^h', // Your App Password or Gmail password
        },
      });
      
      transporter.verify(function(error, success) {
          if (error) {
            console.log('SMTP connection error:', error);
          } else {
            console.log('SMTP connection successful:', success);
          }
        });
  
      const mailOptions = {
        from: 'info@koseli.app', // Sender's email address
        to: email, // Recipient's email address
        subject: 'Account Verification',
        text: `Please click the following link to verify your account: ${verificationLink}`,
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
    } catch (error) {
      console.log('Error sending verification email:', error);
    }
  };

  module.exports= { sendVerificationEmail,generateVerificationToken}; 