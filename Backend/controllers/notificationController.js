require('dotenv').config();
const twilio = require('twilio');

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

exports.sendSMS = async (req, res) => {
  const { to, message } = req.body;

  console.log("Twilio From:", process.env.TWILIO_PHONE_NUMBER);
  console.log("Twilio To:", to);
  console.log("Message:", message);

  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });

    res.status(200).json({ message: 'SMS sent', sid: result.sid });
  } catch (err) {
    console.error("❌ Twilio Error:", err);
    res.status(500).json({ message: 'SMS sending failed', error: err.message });
  }
};