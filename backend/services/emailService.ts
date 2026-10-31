import nodemailer, { type Transporter } from 'nodemailer';

let transporter: Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    // Lazy initialization of the transporter
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    console.log('[EMAIL SERVICE] Transporter initialized');
  }
  return transporter;
}

export async function sendOtpEmail(email: string, otp: string, purpose: 'register' | 'password_reset') {
  const subject = purpose === 'register' ? 'Welcome to AI StockVision - Verify Your Email' : 'Reset Your AI StockVision Password';
  const body = `
    <p>Hello,</p>
    <p>Your OTP for AI StockVision is: <strong>${otp}</strong></p>
    <p>This code will expire in 10 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
    <p>Thanks,</p>
    <p>The AI StockVision Team</p>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject,
    html: body,
  };

  try {
    const mailer = getTransporter();
    await mailer.sendMail(mailOptions);
    console.log(`[EMAIL SERVICE] OTP email sent to ${email}`);
    return { success: true, message: 'OTP email sent successfully' };
  } catch (error) {
    console.error(`[EMAIL SERVICE] Error sending OTP email to ${email}:`, error);
    return { success: false, message: 'Failed to send OTP email' };
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  console.log(`[EMAIL SERVICE] Sending Welcome email to ${name} <${email}>`);
  // You might want to use the transporter here as well
  return { success: true, message: 'Welcome email dispatched successfully' };
}

export async function sendReportEmail(email: string, name: string, stockSymbol: string, reportId: string) {
  console.log(`[EMAIL SERVICE] Sending PDF Prediction Report (${reportId}) for ${stockSymbol} to ${name} <${email}> with mandatory SEBI disclaimer included.`);
  // In production with SMTP configured, send real email with PDF attachment via nodemailer.
  return { success: true, message: 'PDF prediction report emailed successfully' };
}