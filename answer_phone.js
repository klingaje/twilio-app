const express = require('express');
const { twiml: { VoiceResponse } } = require('twilio');
const app = express();

app.post('/voice', (req, res) => {
    const twiml = new VoiceResponse();
    twiml.say("Hi, this is Team Jens and Nico. POST TEST");
    res.type('text/xml');
    res.send(twiml.toString());
});


app.get('/voice', async (req, res) => {
    const twiml = new VoiceResponse();
    const qustionText = await getFiveQuestion();
    twiml.say(qustionText);
    res.type('text/xml');
    res.send(twiml.toString());
});

async function getFiveQuestion() {

    try {
        const response = await fetch('https://opentdb.com/api.php?amount=5&type=boolean');

        if (!response.ok) {
            console.log("response not ok")
        }

        const result = await response.json()
        console.log(result.results[0].question)
        return ("True or False " + result.results[0].question)
    } catch (error) {
        console.error(error.message);
    }


}

app.listen(1337, () => console.log('Team Jens and Nico running on 1337'));
