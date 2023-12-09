"use server";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  pool: true,
  service: "hotmail",
  port: 2525,
  auth: {
    user: "brain-buzz@outlook.com",
    pass: process.env.EMAIL_PASSWORD,
  },
  maxConnections: 1,
});

export const sendEmail = async (
  sendTo: string,
  tokken: string,
  type: string,
) => {
  const mailOptions = {
    from: "brain-buzz@outlook.com",
    to: sendTo,
    html: `<html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f5f5f5;
          color: #333;
          text-align: center;
        }
    
        h1 {
          color: #1f2c64;
          margin-bottom: 20px;
        }
    
        a {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #2196F3;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }
    
        a:hover {
          background-color: #1565c0;
        }
      </style>
    </head>
    <body>
      <h1>Welcome to Your App!</h1>
      <p>We're excited to have you on board. Please click the link below to verify your account.</p>
      <a href="${tokken}" target="_blank">Verify Your Account</a>
      
    </body>
    </html>
    `,
    subject: type,
  };

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) return console.log(error);
  });
};
