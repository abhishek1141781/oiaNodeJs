import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

// Function to initiate a Twilio voice call
export const initiateTwilioCall = async (phoneNumber) => {
  try {
    console.log("i was here 1");

    console.log(" here 2");
    const call = await twilioClient.calls.create({
      url: "http://demo.twilio.com/docs/voice.xml",
    //   add +91 to the phone number
      to: phoneNumber,
      from: process.env.MY_TWILIO_PHONE,
    });
    console.log(`Call initiated to ${phoneNumber}. Call SID: ${call.sid}`);
    return { success: true };
  } catch (error) {
    console.error(`Error initiating call to ${phoneNumber}:`, error);
    return { success: false, error: error.message };
  }
};
