const express = require('express');
const { twiml: { VoiceResponse } } = require('twilio');
const app = express();

app.use(express.urlencoded({ extended: false }));

let questions = [];
let currentQuestion = '';
let correctAnswer = '';
let currentScore = 0;




app.get('/voice', async (req, res) => {
    const twiml = new VoiceResponse();
    const qustionText = await getFiveQuestion();
    twiml.say(questions[0].question);
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

        questions = result.results.map(q => ({
            question: "True or False: " + q.question,
            answer: q.correct_answer.toLowerCase() === "true" ? "1" : "2"
        }));

        return questions[0].question;

        // currentQuestion = "True or False " + result.results[0].question;
        // correctAnswer = result.results[0].correct_answer.toLowerCase() === "true" ? "1" : "2";

        // return currentQuestion;
    } catch (error) {
        console.error(error.message);
    }


}

app.post('/voice', async (req, res) => {
    const twiml = new VoiceResponse();
    let questionText = questions[0].question;

    if (!questions.length) {
        await getFiveQuestion();
        currentScore = 0;
    }

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

    let qIndex = parseInt(req.query.q || '0', 10);
    let score = parseInt(req.query.score || '0', 10);

    if (userInput === questions[qIndex].answer) {
        twiml.say("Correct!");
        score++;
    } else {
        twiml.say("Incorrect.");
    }

    qIndex++;

    if (qIndex < questions.length) {
        const gather = twiml.gather({
            numDigits: 1,
            action: `/gather?q=${qIndex}&score=${score}`,
            method: 'POST'
        });

        gather.say("Next question. Press 1 for True, or 2 for False.");
        gather.say(questions[qIndex].question);
        
        twiml.redirect(`/gather?q=${qIndex}&score=${score}`);
    } else {
        twiml.say(`Game over! You scored ${score} points out of 5 questions. `);
        twiml.say(`Thanks for playing Team Jens and Nico's Trivia!`);
        questions = [];
    }

    res.type('text/xml');
    res.send(twiml.toString());
})

app.listen(1337, () => console.log('Team Jens and Nico running on 1337'));
