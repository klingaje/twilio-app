const express = require('express');
const { twiml: { VoiceResponse } } = require('twilio');
const app = express();


let currentQuestion = '';
let correctAnswer = '';
let currentScore = 0;




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

        currentQuestion = "True or False " + result.results[0].question;
        correctAnswer = result.results[0].correct_answer.toLowerCase() === "true" ? "1" : "2";

        return currentQuestion;
    } catch (error) {
        console.error(error.message);
    }


}

app.post('/voice', async (req, res) => {
    const twiml = new VoiceResponse();
    twiml.say("Hi, this is Team Jens and Nico. POST TEST");
    res.type('text/xml');
    res.send(twiml.toString());

    const questionText = await getFiveQuestion();

    const gather = twiml.gather({
        numDigits: 1,
        action: `/gather`,
        method: 'POST'
    });

    gather.say("Welcome to Team Jens and Nico's True or False Trivia!");
    gather.say("After each question press 1 for true and 2 for false!");
    gather.say(questionText);

    twiml.redirect("/voice"); //redirect if no input from caller
    res.type('text/xml');
    res.send(twiml.toString());
});


app.post('/gather', (req, res) => {
    const twiml = new VoiceResponse();
    const userInput = req.body.Digits;

    if (userInput === correctAnswer) {
        twiml.say("Correct!");
        currentScore++;
    } else {
        twiml.say("Incorrect.")
    }
})

app.listen(1337, () => console.log('Team Jens and Nico running on 1337'));
