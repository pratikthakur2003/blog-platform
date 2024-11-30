const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const HUGGING_FACE_API = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';

// Generate summary for a blog post
router.post('/generate', async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        // Truncate content if it's too long (BART model has a limit)
        const truncatedContent = content.slice(0, 1024);
        const response = await fetch(HUGGING_FACE_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.HUGGING_FACE_TOKEN || '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'}`
            },
            body: JSON.stringify({
                inputs: truncatedContent,
                parameters: {
                    max_length: 150,
                    min_length: 50,
                    do_sample: false
                }
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate summary');
        }

        const data = await response.json();
        const summary = Array.isArray(data) ? data[0].summary_text : data.summary_text;

        res.json({ summary });
    } catch (error) {
        console.error('Summary generation error:', error);
        res.status(500).json({ message: 'Failed to generate summary' });
    }
});

module.exports = router;
