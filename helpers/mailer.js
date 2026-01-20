import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import dotenv from 'dotenv';
import Handlebars from "handlebars";

dotenv.config();

const fromEmail = 'info@limenzydev.com';

/* ✅ REGISTER HELPER */
Handlebars.registerHelper("ifEquals", function (a, b, options) {
  return a === b ? options.fn(this) : options.inverse(this);
});

// Create transporter
const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD,
  },
  secure: false,
  tls: { rejectUnauthorized: false },

});

// Handlebars setup
transport.use(
  "compile",
  hbs({
    viewEngine: {
      handlebars: Handlebars,   // 🔥 REQUIRED
      partialsDir: path.resolve("./views"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./views"),
    extName: ".hbs",
  })
);
// Function to send Job Alert email
export const sendJobAlertEmail = async (to, context) => {
  try {
    const info = await transport.sendMail({
      from: `"JobPortal Team" <${fromEmail}>`,
      to,
      subject: '🎯 New Job Matching Your Skills',
      template: 'job_alert', // name of your .hbs file
      context,
      headers: { 'X-MT-Category': 'Job-Alert' },
    });
   
  } catch (err) {
 
  }
};

/* ✅ SEND INTERVIEW EMAIL */
export const sendInterviewEmail = async (to, context) => {
  await transport.sendMail({
    from: `"JobPortal Team" <${fromEmail}>`,
    to,
    subject: `🎯 Interview Scheduled - ${context.jobTitle}`,
    template: "interview_notification",
    context,
  });

  console.log(`📧 Interview scheduled email sent to ${to}`);
};

