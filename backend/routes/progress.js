const express = require('express');
const router = express.Router();
const ReadingProgress = require('../models/ReadingProgress');
const { protect } = require('../middleware/auth');

// @route   GET /api/progress/:topicId
// @desc    Get user reading progress for a specific topic
// @access  Private
router.get('/:topicId', protect, async (req, res) => {
    try {
        const progress = await ReadingProgress.findOne({
            user: req.user.id,
            topic: req.params.topicId
        });

        if (!progress) {
            return res.json({ currentChapterIndex: 0 });
        }

        res.json(progress);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/progress/:topicId
// @desc    Create or update user reading progress
// @access  Private
router.post('/:topicId', protect, async (req, res) => {
    const { currentChapterIndex } = req.body;

    try {
        let progress = await ReadingProgress.findOne({
            user: req.user.id,
            topic: req.params.topicId
        });

        if (progress) {
            progress.currentChapterIndex = currentChapterIndex;
            await progress.save();
        } else {
            progress = new ReadingProgress({
                user: req.user.id,
                topic: req.params.topicId,
                currentChapterIndex
            });
            await progress.save();
        }

        res.json(progress);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
