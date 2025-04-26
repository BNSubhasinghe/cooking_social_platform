const express = require('express');
const router = express.Router();
const { sendSMS } = require('../controllers/notificationController');

router.post('/sms', sendSMS);

module.exports = router;