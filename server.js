const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/user');

const app = express();
app.use(bodyParser.json());

const SECRET_KEY = 'your_secret_key';

const hashString = (input) => {
    return crypto.createHash('sha256').update(input).digest('hex');
};

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'
    if (!token) return res.sendStatus(403);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};


app.post('/register', async (req, res) => {
    const { email, name, gender, password } = req.body;
    const password_hash = await hashString(password);
    try {
        const user = await User.create({ email, name, gender, password_hash });
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error registering user' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log('Received login request:', email);
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        console.log('User found:', user);
        const isValid = true ? hashString(password) === user.password_hash : false;
        console.log(hashString(password));
        if (!isValid) return res.status(401).json({ message: 'Invalid password' });

        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
        console.log('Generated token:', token);
        res.json({ token });
    } catch (err) {
        console.log('Error during login:', err);
        res.status(500).json({ message: 'Error logging in user' });
    }
});

app.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error getting user info' });
    }
});

app.put('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.update(req.body, { where: { id: req.user.id } });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error updating user info' });
    }
});

app.delete('/me', authenticateToken, async (req, res) => {
    try {
        await User.destroy({ where: { id: req.user.id } });
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});