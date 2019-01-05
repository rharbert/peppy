
////////////////////////////////////////////////////////////////////////////////
// Contact Form Processing as follows:
// 1) Contact form submits data to firestore via HTTP function 
// 2) Non-HTTP Function is triggered  to send email every time a new document is
//    added to firebase (new 'document' for each new contact form submission )
//
//
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
let admin = require('firebase-admin'); // FStore Go
let FieldValue = require('firebase-admin').firestore.FieldValue; // Timestamp Here

const serviceAccount = require('./earring-happiness-firebase-adminsdk-u3m1x-73f0de096e');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://earring-happiness.firebaseio.com'
});

let db = admin.firestore();
const settings = { timestampsInSnapshots: true};
db.settings(settings);

////////////////////////////////////////////////////////////////////////////////
// HTTP Cloud Functions
////////////////////////////////////////////////////////////////////////////////

// Terminate Cloud Functions
// Terminate HTTP functions with res.redirect(), res.send(), or res.end().
// Terminate a synchronous function with a return; statement.
// https://firebase.google.com/docs/functions/terminate-functions

const http = require('http');
const agent = new http.Agent({keepAlive: true});
const cors = require('cors')({origin: true});

/**
 * HTTP Cloud Function that caches an HTTP agent to pool HTTP connections.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */

 exports.connectionPooling = (req, res) => {
  req = http.request({
    host: '',
    port: 80,
    path: '',
    method: 'GET',
    agent: agent
  }, resInner => {
    let rawData = '';
    resInner.setEncoding('utf8');
    resInner.on('data', chunk => { rawData += chunk; });
    resInner.on('end', () => {
      res.status(200).send(`Data: ${rawData}`);
    });
  });
  req.on('error', e => {
    res.status(500).send(`Error: ${e.message}`);
  });
  req.end();
};

////////////////////////////////////////////////////////////////////////////////
// Contact Form Submission /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
exports.contactFormSubmit = functions.https.onRequest((req, res) => {

  cors(req, res, () => {

    // Get proposed new user data from form
    const contactForm = {
      name: req.body.name,
      email: req.body.email,
      message: req.body.message
    };

    db.collection('contactForm').doc().set(contactForm)
      .then(function() {
        return res.send({
          // return empty success response, so client can finish AJAX success
        });
      })
      .catch(function(error) {
        // Empty error
      });
  }); // End CORS
}); // End Cloud Function
//
//
// END: HTTP Cloud Functions
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// Listen for contact form Submissions + Send Email
//
// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// For example and "Steps" see middle of page https://github.com/firebase/functions-samples/tree/master/quickstarts/email-users
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.

////////////////////////////////////////////////////////////////////////////////
// Environment Variables... contain gmail address and password used to send 
//   contact form message to the email address at which you want to receive it
// 1) Add or update environment variables with the following command:
//      $ firebase functions:config:set gmail.email=whatever@gmail.com gmail.password=mypassword emailto.email=whatever@gmail.com
// 2) Use environment variables by adding them as a variable in this file, for example:
//      const emailTo = functions.config().emailto.emaial;
// 3) Deploy functions and the environment variables will be attached to them:
//      $ firebase deploy --only functions
//
const emailTo = functions.config().emailto.email;
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
//
// End Environment variables
////////////////////////////////////////////////////////////////////////////////
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// Your company name to include in the emails
const APP_NAME = 'Earring Happiness';

////////////////////////////////////////////////////////////////////////////////
// NON-HTTP Cloud Functions
////////////////////////////////////////////////////////////////////////////////
// Function is triggered whenever a new 'document' / contact form submission is
// logged to the database
exports.contactFormEventAndEmail = functions.firestore
  .document('contactForm/{formId}')
  .onCreate((snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const newValue = snap.data();

    // access a particular field as you would any JS property
    const contactEmail = newValue.email;
    const contactMessage = newValue.message;
    const contactName = newValue.name;

    // call nodemailer function
    sendContactForm(contactEmail, contactMessage, contactName);

  });

// Sends a welcome email to the given user.
function sendContactForm(contactEmail, contactMessage, contactName) {

  const mailOptions = {
    from: `${APP_NAME} <${gmailEmail}>`,
    to: emailTo
  };
  
  // The user subscribed to the newsletter.
  mailOptions.subject = `${APP_NAME} Contact Inquiry!`;
  mailOptions.text = `
    Contact inquiry from:

    Name: ${contactName}
    Email: ${contactEmail}
    MESSAGE: ${contactMessage}
  `;
  return mailTransport.sendMail(mailOptions).then(() => {
  });
}


