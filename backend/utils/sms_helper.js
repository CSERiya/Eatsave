const twilio = require('twilio');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const otp = Math.floor(100000 + Math.random() * 900000).toString();

const sendSMS = async (to, sentotp) => {
    try {
        const message = await client.messages.create({
            body: `Your verification code is ${sentotp}`,
            from: process.env.TWILIO_PHONE_NO,
            to: to
        });
        console.log("SMS Sent: ", message.sid);
        return message;
    }
    catch (error) {
        console.error("SMS Failed: ", error.message);
        throw error;
    }
}

module.exports = { otp, sendSMS };