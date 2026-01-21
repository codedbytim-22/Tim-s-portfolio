/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();
const db = admin.firestore();

// Configure your email sender (use Gmail or any SMTP service)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "macharia.timothy.dev@gmail.com", // Your Gmail
    pass: "Wrongpassword", // Gmail App Password
  },
});

// Cloud Function to send email when a new contact message is added
exports.sendContactEmail = functions.firestore
  .document("contactMessages/{docId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const mailOptions = {
      from: '"Portfolio Contact" <YOUR_EMAIL@gmail.com>',
      to: "YOUR_EMAIL@gmail.com", // Where you want to receive messages
      subject: `New message from ${data.name}: ${data.subject}`,
      text: `
        Name: ${data.name}
        Email: ${data.email}
        Message: ${data.message}
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  });
