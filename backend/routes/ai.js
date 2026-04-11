const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { protect } = require('../middleware/auth');
const Topic = require('../models/Topic');

// @route   POST /api/ai/generate
// @desc    Generate text continuation using Gemini AI
// @access  Private
router.post('/generate', protect, async (req, res) => {
    const { topicId, currentText, promptText, preferredModel } = req.body;

    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: 'Gemini API Key is missing in backend .env' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const topic = await Topic.findById(topicId);
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }

        const primaryModelStr = preferredModel || "gemini-2.5-flash";
        const primaryModel = genAI.getGenerativeModel({ model: primaryModelStr });
        const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro-latest" });

        let prompt = "";
        if (promptText) {
            prompt = `
            You are a creative writing assistant helping an author write a chapter for a collaborative book.
            Book Topic: ${topic.title}
            Description: ${topic.description}

            The author has written the following text so far:
            "${currentText || ''}"

            The author is specifically asking you this:
            "${promptText}"

            Please fulfill their request. Provide ONLY the text the author requested, with no extra conversational filler.
            `;
        } else {
            prompt = `
            You are a creative writing assistant helping an author write a chapter for a collaborative book.
            Book Topic: ${topic.title}
            Description: ${topic.description}

            The author has written the following text so far:
            "${currentText || ''}"

            Please write the next 2-3 sentences to logically and creatively continue the story. 
            Do not add any conversational filler like "Here are the next sentences:", just return the raw continuation text.
            `;
        }

        let result;
        try {
            result = await primaryModel.generateContent(prompt);
        } catch (primaryError) {
            console.warn('Primary model failed, attempting fallback...', primaryError.message);
            try {
                result = await fallbackModel.generateContent(prompt);
            } catch (fallbackError) {
                throw new Error('Both primary and fallback models failed. (Primary Error: ' + primaryError.message + ')');
            }
        }
        
        const response = result.response;
        const text = response.text();

        res.json({ generatedText: text.trim() });
    } catch (error) {
        console.error('AI Generation Error:', error.message || error);
        // Include some error details for the frontend to display
        res.status(500).json({ message: 'Drafting failed. ' + (error.message || 'The AI might be currently unavailable.') });
    }
});

module.exports = router;
