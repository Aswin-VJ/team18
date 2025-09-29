const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors()); // Enable CORS so frontend can access backend
app.use(bodyParser.json());

// Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_mysql_username',
  password: 'your_mysql_password',
  database: 'userdb'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL!');
});

// Signup endpoint
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send('Missing username or password');

  const hashedPassword = bcrypt.hashSync(password, 8);

  const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.query(sql, [username, hashedPassword], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).send('Username already exists');
      return res.status(500).send('Database error');
    }
    res.send('User registered successfully');
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send('Missing username or password');

  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], (err, results) => {
    if (err) return res.status(500).send('Database error');
    if (results.length === 0) return res.status(400).send('User not found');

    const user = results[0];
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return res.status(401).send('Invalid password');

    res.send('Login successful');
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
