const express = require('express');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const router = express.Router();

router.post('/send-whatsapp', async (req, res) => {
  const { to, message } = req.body;

  try {
    await client.messages.create({
      from: 'whatsapp:+14155238886', 
      to: 'whatsapp:+255742825552',
      body: message
    })
    .then(message => console.log(message.sid))
    .done();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;