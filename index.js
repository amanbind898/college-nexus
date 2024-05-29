const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

let collegeData = [];

// Load data from CSV
fs.createReadStream('college_data.csv')
  .pipe(csv())
  .on('data', (row) => {
    collegeData.push(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
    console.log('Loaded college data:', collegeData);  // Debug statement
  });

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to serve static files
app.use(express.static('public'));

// Middleware to enable CORS
app.use(cors());

// Endpoint to predict colleges
app.post('/predict', (req, res) => {
  const { rank } = req.body;
  console.log('Received rank:', rank);  // Debug statement

  if (!rank) {
    return res.status(400).json({ error: 'Rank is required' });
  }

  const eligibleColleges = collegeData.filter(college => {
    const openingRank = parseInt(college['Opening Rank']);
    const closingRank = parseInt(college['Closing Rank']);
    console.log(`College: ${college['Institute']}, Opening Rank: ${openingRank}, Closing Rank: ${closingRank}`);  // Debug statement
    return rank >= openingRank && rank <= closingRank;
  });

 // console.log('Eligible colleges:', eligibleColleges);  // Debug statement

  res.json({ eligibleColleges });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
