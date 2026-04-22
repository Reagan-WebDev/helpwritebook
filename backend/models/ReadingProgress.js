const mongoose = require('mongoose');

const ReadingProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true,
    },
    currentChapterIndex: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

// Ensure a user has only one progress record per topic
ReadingProgressSchema.index({ user: 1, topic: 1 }, { unique: true });

module.exports = mongoose.model('ReadingProgress', ReadingProgressSchema);
