const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

// Database configuration
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'kasutajad',
  password: 'your_password',
  port: 5432,
});

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));

// Route to handle form submissions
app.post('/submit-form', async (req, res) => {
    const { name, email, phone } = req.body;
  
    try {
      // Insert form data into the database
      const result = await pool.query('INSERT INTO data (Name, Email, Phone) VALUES ($1, $2, $3)', [name, email, phone]);
      res.send('Form submitted successfully!');
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).send('An error occurred while submitting the form');
    }
  });  

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
