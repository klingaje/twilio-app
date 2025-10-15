const express = require('express');
const { twiml: { VoiceResponse } } = require('twilio');
const app = express();

app.post('/voice', (req, res) => {
  const twiml = new VoiceResponse();
  twiml.say("Hi, this is Team Jens and Nico. POST TEST");
  res.type('text/xml');
  res.send(twiml.toString());
});


app.get('/voice', (req, res) => {
  const twiml = new VoiceResponse();
  twiml.say("Hi, this is Team Jens and Nico. GET TEST");
  res.type('text/xml');
  res.send(twiml.toString());
});


app.listen(1337, () => console.log('Team Jens and Nico running on 1337'));
