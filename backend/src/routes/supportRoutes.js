const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');

router.get('/faqs', supportController.getFaqs);
router.get('/contact', supportController.getContactInfo);
router.post('/ticket', supportController.submitSupportTicket);

module.exports = router;
