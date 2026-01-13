const {sendUserBookingTrainingEmail, sendAdminBookingTrainingEmail, sendUserBookingSessionEmail, sendAdminBookingSessionEmail } = require('../config/email');
const TrainingJourney = require('../model/training')
const BookSession = require('../model/session');


exports.bookTraining = async (req, res) => {
    try {
        const {fullName, email, phoneNumber, experienceLevel, plan, fitnessGoal } = req.body;

        // Create a new booking
      const booking = await TrainingJourney.create({
            fullName,
            email,
            phoneNumber,
            experienceLevel,
            plan,
            fitnessGoal
        });

        // Send email to user confirming booking
        await sendUserBookingTrainingEmail(email, fullName, plan, experienceLevel, fitnessGoal);

        // Send email to admin
        const adminEmail = process.env.ADMIN_EMAIL || "tosinsirmuel@gmail.com";
        await sendAdminBookingTrainingEmail(adminEmail, fullName, email, phoneNumber, plan, experienceLevel, fitnessGoal);

        res.status(201).json({ success: true, message: "Training session booked successfully", booking });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to book training session", error: error.message });
    }
};

exports.bookSession = async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;

    // i want to save the booking to the database
    const booking = await BookSession.create({
      fullName,
        email,
        subject,
        message
    });

    // Send email to user confirming booking
    await sendUserBookingSessionEmail(email, fullName);

    // Send email to admin
    const adminEmail = process.env.ADMIN_EMAIL || "tosinsirmuel@gmail.com";
    await sendAdminBookingSessionEmail(adminEmail, fullName, email, subject, message);

    res.status(201).json({ success: true, message: "Session Booked successfully", booking });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to subscribe", error: error.message });
  }
};