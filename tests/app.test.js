
import request from 'supertest'
import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from '../answer_phone'

global.fetch = vi.fn()

beforeEach(() => {
    fetch.mockReset();
})

describe('Express app routes', () => {
    it('should return TwiML from /voice', () => {

    })

    it('GET /voice should return TwiML with the first question', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                results: [
                    { question: 'The sky is blue.', correct_answer: 'True' },
                    { question: '2 + 2 = 5', correct_answer: 'False' },
                    { question: 'Water is wet.', correct_answer: 'True' },
                    { question: 'Dogs can fly.', correct_answer: 'False' },
                    { question: 'Fire is cold.', correct_answer: 'False' }
                ]
            })
        })
        const res = await request(app)
            .get('/voice')
            .expect('Content-Type', /xml/)
            .expect(200)

        expect(res.text).toContain('True or False: The sky is blue.')
    })

    it('POST /gather should respond with next question or game over', async () => {
        global.questions = [
            { question: 'The sky is blue.', answer: '1' },
            { question: '2 + 2 = 5', answer: '2' }
        ]

        const res = await request(app)
            .post('/gather?q=0&score=0')
            .send('Digits=1')
            .expect('Content-Type', /xml/)
            .expect(200)

        expect(res.text).toContain('Correct!')
        expect(res.text).toContain('Next question. Press 1 for True, or 2 for False')
    })

    it('should end the game when all questions answered', async () => {
        global.questions = [
            { question: 'Only one question left.', answer: '1' }
        ];

        const res = await request(app)
            .post('/gather?q=4&score=0')
            .send('Digits=1')
            .expect('Content-Type', /xml/)
            .expect(200)

        expect(res.text).toContain('Game over!');
        expect(res.text).toContain('Thanks for playing Team Jens and Nico\'s Trivia!')
    });
})