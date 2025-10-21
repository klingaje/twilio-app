import { describe, it, expect, vi } from 'vitest'
import { getFiveQuestion } from '../answer_phone'

global.fetch = vi.fn()

describe('getFiveQuestion', () => {
    it('should fetch and return formatted question', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                results: [
                    { question: 'The sky is blue.', correct_answer: 'True' }
                ]
            })
        })
        const question = await getFiveQuestion()

        expect(typeof question).toBe('string')
        expect(question.startsWith('True or False:')).toBe(true)
    })

    it('should return [] when fetch fails', async () => {
        fetch.mockRejectedValueOnce(new Error('network error'))
        const questions = await getFiveQuestion()
        expect(questions).toEqual([])
    })
})
