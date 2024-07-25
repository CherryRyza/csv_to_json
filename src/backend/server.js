import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import multer from 'multer';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import iconv from 'iconv-lite';

const app = express();
const PORT = 8080;

const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(bodyParser.json());

// MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '198732',
  database: 'csv_to_json',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Check database connection
app.get('/check-db-connection', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      await connection.ping();
      connection.release();
      res.status(200).json({ message: 'Database connection successful' });
    } catch (error) {
      console.error('Error connecting to database:', error);
      res.status(500).json({ message: 'Error connecting to database', error: error.message });
    }
});

// Register
app.post('/register', async (req,res) => {
    const {username, password} = req.body;
    try{

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query('INSERT INTO users (id, username, password) VALUES (?, ?, ?)', [
            uuidv4(),
            username,
            hashedPassword
        ]);
        console.log(result);
        res.status(201).json({ message: 'User registered successfully' });
    }catch (error){
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }

});

// Login
app.post('/login', async (req,res) => {
    const { username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
      }
    
      try {
        const [result] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    
        if (result.length === 0) {
          return res.status(400).json({ message: 'User does not exist' });
        }
    
        const user = result[0];
    
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
  
        res.status(200).json({ message: 'Login success' });
  
      } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Server error' });
      }
});

// Upload data csv to database
app.post('/upload', upload.single('csvfile'), async (req, res) => {
  const filePath = req.file.path;
  const results = [];
  fs.createReadStream(filePath)
      .pipe(iconv.decodeStream('windows-874')) // Decode using Windows-874
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
          try {
              const query = 'INSERT INTO csv_data (username, department, license, installed, brand, model, serial) VALUES ?';
              const values = results.map(row => [
                  row.username, row.department, row.license, row.Installed, row.brand, row.model, row.serial
              ]);
              const [rows, fields] = await pool.query(query, [values]); 
              res.json({ success: true });
          } catch (error) {
              console.error(error);
              res.status(500).json({ error: error.message });
          } finally {
              // Remove the uploaded file after processing
              fs.unlink(filePath, (error) => {
                  if (error) console.error(error);
              });
          }
      });
});

// Show CSV data in Database
app.get('/data', async (req, res) => {
  try{
    const [rows] = await pool.query("SELECT * FROM csv_data");
    res.status(200).json(rows);
  }catch(error){
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Export data in database to json
app.get('/export', async (req, res) => {
  try {
      const [rows] = await pool.query("SELECT * FROM csv_data");

      // Set headers for file download with hard-coded filename
      res.setHeader('Content-Disposition', 'attachment; filename="data.json"');
      res.setHeader('Content-Type', 'application/json');

      // Send JSON response
      res.send(JSON.stringify(rows, null, 2));
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
  }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});