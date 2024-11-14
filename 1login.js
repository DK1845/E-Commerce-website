const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'deep@619',
    database: 'ipl'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to database');
});

// Serve static files (like HTML)
app.use(express.static('public'));

// Sign Up route
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    // Hash password for security
    const hashedPassword = bcrypt.hashSync(password, 10);

    // SQL Query to insert new user
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.send('Username or Email already exists');
            }
            return res.send('Error occurred');
        }
        res.redirect('/2home.html');
    });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // SQL Query to find the user
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, result) => {
        if (err || result.length === 0) {
            return res.send('User not found');
        }

        const user = result[0];

        // Compare hashed password
        if (bcrypt.compareSync(password, user.password)) {
            res.redirect('/2home.html');
        } else {
            res.send('Incorrect password');
        }
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
