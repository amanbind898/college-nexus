const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

let collegeData = [];

// Construct the absolute path to the CSV file
const csvFilePath = path.join(__dirname, 'NIT.csv');

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    // Clean up the row by removing extra spaces and quotes
    const cleanedRow = {};
    for (const key in row) {
      cleanedRow[key.trim().replace(/^"|"$/g, '')] = row[key].trim().replace(/^"|"$/g, '');
    }

    // Parse ranks as integers
    const openingRank = parseInt(cleanedRow['Opening Rank']);
    const closingRank = parseInt(cleanedRow['Closing Rank']);

    // Validate ranks and add to collegeData if valid
    if (!isNaN(openingRank) && !isNaN(closingRank)) {
      collegeData.push({
        ...cleanedRow,
        'Opening Rank': openingRank,
        'Closing Rank': closingRank,
      });
    } else {
      console.error(`Invalid rank data: ${JSON.stringify(cleanedRow)}`);
    }
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
    console.log('Loaded college data:', collegeData.length);
  })
  .on('error', (err) => {
    console.error('Error reading CSV file:', err);
  });

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

app.post('/predict', (req, res) => {
  const { rank, category, gender, seatType, collegeType } = req.body;
  console.log('Received data:', { rank, category, gender, seatType, collegeType });

  if (!rank || !category || !gender || !seatType || !collegeType) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const rankInt = parseInt(rank);

  const eligibleColleges = collegeData.filter(college => {
    const openingRank = college['Opening Rank'];
    const closingRank = college['Closing Rank'];
    return (
      rankInt >= openingRank &&
      rankInt <= closingRank &&
      college['Quota'] === category && // Ensure the category matches the quota
      college['Gender'] === gender &&
      college['Seat Type'] === seatType &&
      college['Institute Type'] === collegeType // Filter by college type
    );
  });

  res.json({ eligibleColleges });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
