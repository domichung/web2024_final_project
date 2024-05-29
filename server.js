const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

const usersFilePath = path.join(__dirname, 'users.json');

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    fs.readFile(usersFilePath, (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to read user data.' });
        }
        const users = JSON.parse(data);
        if (users.find(u => u.username === username)) {
            return res.status(400).json({ success: false, message: 'Username already exists.' });
        }

        users.push({ username, password, score: 0 });
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Failed to save user data.' });
            }
            res.json({ success: true, message: 'Registration successful.' });
        });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    fs.readFile(usersFilePath, (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to read user data.' });
        }
        const users = JSON.parse(data);
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            res.json({ success: true, message: 'Login successful.' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid username or password.' });
        }
    });
});

app.post('/get-score', (req, res) => {
    const { username } = req.body;
    fs.readFile(usersFilePath, (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to read user data.' });
        }
        const users = JSON.parse(data);
        const user = users.find(u => u.username === username);
        if (user) {
            res.json({ success: true, score: user.score });
        } else {
            res.status(400).json({ success: false, message: 'User not found.' });
        }
    });
});

app.post('/update-score', (req, res) => {
    const { username, score } = req.body;
    fs.readFile(usersFilePath, (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to read user data.' });
        }
        const users = JSON.parse(data);
        const user = users.find(u => u.username === username);
        if (user) {
            user.score = score;
            fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Failed to update user data.' });
                }
                res.json({ success: true });
            });
        } else {
            res.status(400).json({ success: false, message: 'User not found.' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
