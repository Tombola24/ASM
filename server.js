const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const router = require('./router'); // Importing router module
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const port = 8000;

// Middleware
app.use(cors()); 
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public')));
app.use (cookieParser());

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } // Set to true if using HTTPS
}));

// Routes
app.use('/api', router); 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error while logging out.');
        }
        res.redirect('/'); // Redirect to the first page after logout
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
