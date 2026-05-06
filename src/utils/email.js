const nodemailer = require("nodemailer")

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS
    }
  })
}

const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter()
  const info = await transporter.sendMail({
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to,
    subject,
    html
  })
  console.log(`Email sent: ${info.messageId}`)
  return info
}

const emailTemplates = {
  verifyEmail: (name, verifyUrl) => ({
    subject: "Verify Your HireFlow Email",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2>Welcome to HireFlow, ${name}!</h2>
        <p>Click below to verify your email:</p>
        <a href="${verifyUrl}"
           style="background:#4F46E5;color:white;padding:12px 24px;
                  text-decoration:none;border-radius:4px;display:inline-block">
          Verify Email
        </a>
        <p>Link expires in 24 hours.</p>
      </div>
    `
  }),

  resetPassword: (name, resetUrl) => ({
    subject: "HireFlow Password Reset",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2>Password Reset Request</h2>
        <p>Hi ${name}, click below to reset your password:</p>
        <a href="${resetUrl}"
           style="background:#DC2626;color:white;padding:12px 24px;
                  text-decoration:none;border-radius:4px;display:inline-block">
          Reset Password
        </a>
        <p>Link expires in 10 minutes.</p>
      </div>
    `
  }),

  welcomeEmail: (name) => ({
    subject: "Welcome to HireFlow!",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2>Email Verified!</h2>
        <p>Hi ${name}, your email has been verified successfully.</p>
        <p>You can now apply for jobs on HireFlow.</p>
      </div>
    `
  }),

  applicationReceived: (candidateName, jobTitle, company) => ({
    subject: `Application Received — ${jobTitle}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2>Application Received!</h2>
        <p>Hi ${candidateName},</p>
        <p>Your application for <strong>${jobTitle}</strong>
           at <strong>${company}</strong> has been received.</p>
        <p>We will notify you when your status changes.</p>
      </div>
    `
  }),

  applicationStatusUpdate: (candidateName, jobTitle, status) => ({
    subject: `Application Update — ${jobTitle}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2>Application Status Update</h2>
        <p>Hi ${candidateName},</p>
        <p>Your application for <strong>${jobTitle}</strong>:</p>
        <p style="font-size:18px;color:#4F46E5">
          <strong>${status.toUpperCase()}</strong>
        </p>
      </div>
    `
  })
}

module.exports = { sendEmail, emailTemplates }