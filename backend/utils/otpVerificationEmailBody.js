const otpVerificationEmailBody = (firstName, otp, fromEmailId, purpose) => {
  if (purpose == "passwordReset")
    return `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #dddddd;
    }
    .header h1 {
      color: #333333;
      font-size: 24px;
      margin: 0;
    }
    .content {
      padding: 20px 0;
      color: #555555;
    }
    .content p {
      line-height: 1.6;
      margin: 0;
    }
    .otp {
      display: inline-block;
      padding: 10px 20px;
      margin: 20px 0;
      background-color: #007BFF;
      color: #ffffff;
      font-size: 20px;
      font-weight: bold;
      border-radius: 5px;
      text-align: center;
    }
    .footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #dddddd;
      color: #888888;
      font-size: 12px;
    }
    .footer a {
      color: #007BFF;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Hirelium</h1>
    </div>
    <div class="content">
      <p>Dear ${firstName},</p>
      <p>You recently requested to reset your password for your Hirelium account. Please use the following One-Time Password (OTP) to proceed with resetting your password:</p>
      <div class="otp">${otp}</div>
      <p>This OTP is valid for the next 5 minutes. If you did not request a password reset, please ignore this email or contact our support team.</p>
      <p>Thank you for choosing Hirelium!</p>
      <p>Best regards,<br>Hirelium Team</p>
    </div>
    <div class="footer">
      <p>If you have any questions, feel free to <a href="mailto:${fromEmailId}">contact us</a>.</p>
    </div>
  </div>
</body>
</html>
`;
  if (purpose == "companyEmailVerification")
    return `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #dddddd;
    }
    .header h1 {
      color: #333333;
      font-size: 24px;
      margin: 0;
    }
    .content {
      padding: 20px 0;
      color: #555555;
    }
    .content p {
      line-height: 1.6;
      margin: 0;
    }
    .otp {
      display: inline-block;
      padding: 10px 20px;
      margin: 20px 0;
      background-color: #007BFF;
      color: #ffffff;
      font-size: 20px;
      font-weight: bold;
      border-radius: 5px;
      text-align: center;
    }
    .footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #dddddd;
      color: #888888;
      font-size: 12px;
    }
    .footer a {
      color: #007BFF;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Hirelium</h1>
    </div>
    <div class="content">
      <p>Dear ${firstName},</p>
      <p>Welcome to Hirelium! , please verify your company email by using the following One-Time Password (OTP):</p>
      <div class="otp">${otp}</div>
      <p>This OTP is valid for the next 5 minutes.</p>
      <p>Thank you for choosing Hirelium!</p>
      <p>Best regards,<br>Hirelium Team</p>
    </div>
    <div class="footer">
      <p>If you have any questions, feel free to <a href="mailto:${fromEmailId}">contact us</a>.</p>
    </div>
  </div>
</body>
</html>
`;
  return null;
};

export default otpVerificationEmailBody;
