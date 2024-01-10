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
  email: string,
  htmlContent: string,
  subject: string,
) => {
  const mailOptions = {
    from: "brain-buzz@outlook.com",
    to: email,
    html: htmlContent,
    subject,
  };
  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error: any, info: any) => {
 
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};
