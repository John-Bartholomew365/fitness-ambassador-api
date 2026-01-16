require("dotenv").config();
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

const sendRegistrationEmail = async (email, fullName) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: [email],
    subject: `Hello ${fullName}, Your Registration is Pending Approval`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px;">
          <img src="https://i.imgur.com/Qf5RI2E.png" alt="Victhaw Official Logo" style="max-width: 100px; margin-bottom: 20px;">
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
          <h2 style="text-align: center; color: #C81E23;">Hello ${fullName},</h2>
          <p style="font-size: 16px; line-height: 1.6;">
            Thank you for registering for the <strong>Fittness Ambassador</strong>.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            Your registration has been received and is now pending approval. 
            The admin will review your payment and confirm your registration within 24 hours.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            If you have any questions, please feel free to reach out to us.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            Best regards,<br>
            <strong>The Fittness Ambassador Official Team</strong>
          </p>
        </div>
        <div style="text-align: center; margin-top: 20px; font-size: 14px; color: #777;">
          <p>If you have any questions, feel free to contact us at 
            <a href="fitnessambassador84@gmail.com" style="color: #C81E23; text-decoration: none;">
              fitnessambassador84@gmail.com
            </a>.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await resend.emails.send(mailOptions);
    console.log("Registration email sent successfully");
  } catch (error) {
    console.error("Failed to send registration email:", error);
  }
};

const sendPaymentConfirmationEmail = async (email, fullName) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: [email],
    subject: "Payment Approved",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px;">
          <img src="https://i.imgur.com/Qf5RI2E.png" alt="Victhaw Official Logo" style="max-width: 100px; margin-bottom: 20px;">
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
          <h2 style="color: #C81E23; text-align: center;">Payment Approved</h2>
          <p style="font-size: 16px; line-height: 1.6;">
            Hello <span style="color: #C81E23;">${fullName}</span>,<br><br>
            Your payment has been successfully approved. You can now log in to your account and access all the features.<br><br>
            If you have any questions or need further assistance, feel free to contact us.<br><br>
            Best regards,<br>
            <strong>Victhaw Official</strong>
          </p>
          <div style="text-align: center; margin-top: 20px;">
            <a href="victhawofficial.com/login" style="background-color: #C81E23; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
              Log In Now
            </a>
          </div>
        </div>
        <div style="text-align: center; margin-top: 20px; font-size: 14px; color: #777;">
          <p>If you did not make this request, please ignore this email.</p>
        </div>
      </div>
    `,
  };

  try {
    await resend.emails.send(mailOptions);
    console.log("Payment confirmation email sent successfully");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

const sendApprovalEmail = async (email, fullName, registration_id) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: [email],
    subject: "Tradfit Registration Approved 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px;">
          <img src="https://i.imgur.com/Qf5RI2E.png" alt="Tradfit Logo" style="max-width: 120px; margin-bottom: 20px;">
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
          <h2 style="color: #28a745; text-align: center;">Registration Approved ✅</h2>
          <p>Hello <strong>${fullName}</strong>,</p>
          <p>Your registration for <strong>Tradfit Rhythms</strong> has been approved!</p>
          <p>Your Ticket ID is:</p>
          <div style="text-align: center; margin: 20px 0;">
            <div style="display: inline-block; background-color: #28a745; color: #fff; padding: 12px 24px; font-size: 22px; font-weight: bold; border-radius: 5px;">
              ${registration_id}
            </div>
          </div>
          <p>Bring this Ticket ID along with your details to the event for confirmation.</p>
          <p>We look forward to seeing you! 🎉</p>
          <p>Best regards,<br><strong>The Tradfit Rhythms Team</strong></p>
        </div>
      </div>
    `,
  };

  await resend.emails.send(mailOptions);
  console.log("Approval email sent to:", email);
};

const sendRejectionEmail = async (email, fullName, admin_message) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: [email],
    subject: "Tradfit Registration Rejected ❌",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px;">
          <img src="https://i.imgur.com/Qf5RI2E.png" alt="Tradfit Logo" style="max-width: 120px; margin-bottom: 20px;">
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
          <h2 style="color: #dc3545; text-align: center;">Registration Rejected ❌</h2>
          <p>Hello <strong>${fullName}</strong>,</p>
          <p>Unfortunately, your registration for <strong>Tradfit</strong> has been rejected.</p>
          <p>Reason:</p>
          <blockquote style="font-style: italic; color: #555;">${admin_message || "No reason provided"}</blockquote>
          <p>You may try registering again or contact support for clarification.</p>
          <p>Best regards,<br><strong>The Tradfit Team</strong></p>
        </div>
      </div>
    `,
  };

  await resend.emails.send(mailOptions);
  console.log("Rejection email sent to:", email);
};

// Email to user confirming booking
const sendUserBookingTrainingEmail = async (email, fullName, plan, experienceLevel, fitnessGoal) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: [email],
    subject: `Training Session Booking Confirmation`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px;">
          <img src="https://i.imgur.com/Qf5RI2E.png" alt="Logo" style="max-width: 100px; margin-bottom: 20px;">
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
          <h2 style="text-align: center; color: #C81E23;">Hi ${fullName},</h2>
          <p style="font-size: 16px; line-height: 1.6;">
            You have successfully booked a <strong>${plan}</strong> training session with us.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            Experience Level: <strong>${experienceLevel}</strong><br>
            Fitness Goals: <strong>${fitnessGoal}</strong>
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            Our admin will reach out to you within 24 hours to finalize your session details.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            Thank you for choosing us!
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            Best regards,<br>
            <strong>The Fitness Team</strong>
          </p>
        </div>
      </div>
    `
  };

  try {
    await resend.emails.send(mailOptions);
    console.log("User booking email sent successfully");
  } catch (error) {
    console.error("Failed to send user booking email:", error);
  }
};

// Email to admin notifying new booking
const sendAdminBookingTrainingEmail = async (adminEmail, fullName, email, phoneNumber, plan, experienceLevel, fitnessGoal) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: adminEmail,
    subject: `New Training Booking Received`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
          <h2 style="color: #C81E23;">New Training Session Booking</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone Number:</strong> ${phoneNumber}</p>
          <p><strong>Experience Level:</strong> ${experienceLevel}</p>
          <p><strong>Plan:</strong> ${plan}</p>
          <p><strong>Fitness Goals:</strong> ${fitnessGoal}</p>
          <p>Please reach out to the user within 24 hours.</p>
        </div>
      </div>
    `
  };

  try {
    await resend.emails.send(mailOptions);
    console.log("Admin booking email sent successfully");
  } catch (error) {
    console.error("Failed to send admin booking email:", error);
  }
};

const sendNewsletterConfirmation = async (email) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: [email],
    subject: "You Subscribed to Our Newsletter 🎉",
    html: `
      <div style="font-family: Arial; max-width:600px; margin:auto;">
        <h2>Thank you for subscribing!</h2>
        <p>You've successfully joined our newsletter community.</p>
        <p>You will now receive updates, training tips, news & offers.</p>

        <p style="margin-top:20px;">Best regards,<br><strong>Fitness Ambassador Team</strong></p>
      </div>
    `
  };

  try {
    await resend.emails.send(mailOptions);
    console.log("Newsletter confirmation email sent successfully");
  } catch (error) {
    console.error("Failed to send newsletter email:", error);
  }
};

// Email to user confirming booking session
const sendUserBookingSessionEmail = async (email, fullName) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: [email],
    subject: `Your Session Booking Was Received 🎉`,
    html: `
      <div style="font-family: Arial; max-width:600px; margin:auto;">
        <h2>Hello ${fullName},</h2>
        <p>Thank you for booking a session with us.</p>
        <p>Our admin team has received your request and will reach out to you within <strong>24 hours</strong>.</p>

        <p style="margin-top:20px;">Best regards,<br>
        <strong>Fitness Ambassador Team</strong></p>
      </div>
    `
  };

  try {
    const response = await resend.emails.send(mailOptions);
    console.log("Resend response:", response);
    console.log("User booking email sent successfully");
  } catch (error) {
    console.error("Failed to send user booking email:", error);
  }
};

// Email to admin notifying new booking session
const sendAdminBookingSessionEmail = async (adminEmail, fullName, email, subject, message) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: adminEmail,
    subject: `📩 New Training Session Booking`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
          <h2 style="color: #C81E23;">New Session Booking Alert</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong> ${message}</p>
          <p>Please reach out to the user within 24 hours.</p>
        </div>
      </div>
    `
  };

  try {
    await resend.emails.send(mailOptions);
    console.log("Admin booking email sent successfully");
  } catch (error) {
    console.error("Failed to send admin booking email:", error);
  }
};

// Email to user confirming partner application
const sendUserPartnershipApplicationEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: [email],
    subject: `Your Partnership Application Was Received 🤝`,
    html: `
      <div style="font-family: Arial; max-width:600px; margin:auto;">
        <h2>Hello ${name},</h2>
        <p>Thank you for applying to become a Partner with us.</p>

        <p>Your application has been received and is currently under review.</p>

        <p>You will be notified once it is <strong>approved or rejected</strong>.</p>

        <p style="margin-top:20px;">
          Best Regards,<br>
          <strong>Fitness Ambassador Team</strong>
        </p>
      </div>
    `
  };

  try {
    await resend.emails.send(mailOptions);
    console.log("User booking email sent successfully");
  } catch (error) {
    console.error("Failed to send user booking email:", error);
  }
};

// Email to admin notifying new partner application
const sendAdminPartnershipApplicationRequestEmail = async (adminEmail, name, email, phone, brandType, message) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: adminEmail,
    subject: `📢 New Partner Application Received`,
    html: `
      <div style="font-family: Arial; max-width:600px; margin:auto;">
        <h2>New Partnership Application</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Brand Type:</strong> ${brandType}</p>
        <p><strong>Message:</strong> ${message}</p>

        <p style="margin-top:20px;">
          Please review and take action in the admin dashboard.
        </p>
      </div>
    `
  };

  try {
    await resend.emails.send(mailOptions);
    console.log("Admin booking email sent successfully");
  } catch (error) {
    console.error("Failed to send admin booking email:", error);
  }
};





module.exports = { 
  resend,
  sendRegistrationEmail, 
  sendPaymentConfirmationEmail, 
  sendApprovalEmail, 
  sendRejectionEmail, 
  sendUserBookingTrainingEmail, 
  sendAdminBookingTrainingEmail,
  sendNewsletterConfirmation,
  sendUserBookingSessionEmail,
  sendAdminBookingSessionEmail,
  sendUserPartnershipApplicationEmail,
  sendAdminPartnershipApplicationRequestEmail
};
