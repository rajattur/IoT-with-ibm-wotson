const express = require('express');
const router = express.Router();
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const {createUserEntry} = require('../playground')

router.get('/', (req, res) => {
    createUserEntry(req,res,req.query)
});


module.exports = router;