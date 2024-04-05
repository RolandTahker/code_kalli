const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'postgres', // Use 'postgres' as the username
  host: 'localhost',
  database: 'kasutajad',
  password: 'Papagoi12', // Leave the password field empty if you haven't set one
  port: 5432,
});

  

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

// Route to handle form submissions
app.post('/submit-form', async (req, res) => {
  const { nimi, email, telefon } = req.body;

  try {
    // Insert form data into the database
    const result = await pool.query('INSERT INTO andmed (nimi, email, telefon) VALUES ($1, $2, $3)', [nimi, email, telefon]);
    res.send('Form submitted successfully!');
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send(`An error occurred while submitting the form: ${error.message}`);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
