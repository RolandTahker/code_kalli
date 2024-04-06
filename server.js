const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const bodyParser = require('body-parser'); // Import body-parser

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'kasutajad',
  password: 'Papagoi12',
  port: 5432,
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

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

// Route to display data as a table
app.get('/data', async (req, res) => {
  try {
    // Query database to fetch user data
    const result = await pool.query('SELECT * FROM andmed');

    // Generate HTML for the table
    const tableHtml = `
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>User Data Table</title>
          <style>
              table {
                  width: 80%; /* Adjust the width as needed */
                  margin: auto; /* Center the table horizontally */
                  border-collapse: collapse;
              }
              th, td {
                  border: 1px solid #ddd;
                  padding: 8px;
                  text-align: left;
              }
              th {
                  background-color: #f2f2f2;
              }
              h2 {
                  text-align: center;
              }
          </style>
      </head>
      <body>
          <h2>Kasutajate andmed</h2>
          <table>
              <thead>
                  <tr>
                      <th>ID</th>
                      <th>Nimi</th>
                      <th>Email</th>
                      <th>Telefon</th>
                  </tr>
              </thead>
              <tbody>
                  ${result.rows.map(row => `
                      <tr>
                          <td>${row.id}</td>
                          <td>${row.nimi}</td>
                          <td>${row.email}</td>
                          <td>${row.telefon}</td>
                      </tr>
                  `).join('')}
              </tbody>
          </table>
      </body>
      </html>
    `;

    // Send the HTML response
    res.send(tableHtml);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('An error occurred while fetching user data');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
