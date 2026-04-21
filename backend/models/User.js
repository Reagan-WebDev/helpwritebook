const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    googleId: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    preferences: {
        theme: { type: String, default: 'dark' },
        font: { type: String, default: 'sans' },
        background: { type: String, default: 'default' },
        aiModel: { type: String, default: 'gemini-2.5-flash' }
    },
    profilePicture: { 
        type: String, 
        default: '' 
    },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
