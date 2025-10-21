
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
        
    })
})