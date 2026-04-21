const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/auth');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({ name, email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { id: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            preferences: user.preferences,
            profilePicture: user.profilePicture,
            token
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = { id: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            preferences: user.preferences,
            profilePicture: user.profilePicture,
            token
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/auth/me
// @desc    Get user data
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/auth/preferences
// @desc    Update user aesthetic preferences
// @access  Private
router.put('/preferences', protect, async (req, res) => {
    try {
        const { theme, font, background, aiModel } = req.body;
        const user = await User.findById(req.user.id);
        
        if (theme) user.preferences.theme = theme;
        if (font) user.preferences.font = font;
        if (background) user.preferences.background = background;
        if (aiModel) user.preferences.aiModel = aiModel;
        
        await user.save();
        res.json(user.preferences);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/auth/profile-picture
// @desc    Update user profile picture base64 string
// @access  Private
router.put('/profile-picture', protect, async (req, res) => {
    try {
        const { profilePicture } = req.body;
        const user = await User.findById(req.user.id);
        
        user.profilePicture = profilePicture;
        
        await user.save();
        res.json({ message: 'Profile picture updated', profilePicture: user.profilePicture });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/google
// @desc    Authenticate with Google
// @access  Public
router.post('/google', async (req, res) => {
    const { credential } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub, email, name, picture } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                name,
                email,
                profilePicture: picture,
                authProvider: 'google',
                googleId: sub
            });
            await user.save();
        } else if (!user.googleId) {
            user.googleId = sub;
            user.authProvider = 'google';
            user.profilePicture = user.profilePicture || picture;
            await user.save();
        }

        const jwtPayload = { id: user.id };
        const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            preferences: user.preferences,
            profilePicture: user.profilePicture,
            token
        });
    } catch (error) {
        console.error(error.message);
        res.status(401).json({ message: 'Google authentication failed' });
    }
});

module.exports = router;
