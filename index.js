const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

let collegeData = [];

const csvFilePath = path.join(__dirname, 'orcrdata.csv'); 

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    const cleanedRow = {};
    for (const key in row) {
      // Remove extra double quotes from keys and values
      const cleanedKey = key.trim().replace(/^"|"$/g, '');
      const cleanedValue = row[key].trim().replace(/^"|"$/g, '');
      cleanedRow[cleanedKey] = cleanedValue;
    }

    const openingRank = parseInt(cleanedRow['Opening Rank']);
    const closingRank = parseInt(cleanedRow['Closing Rank']);

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
  const { rank, seatType, gender, collegeType } = req.body;
  console.log('Received data:', { rank, seatType, gender, collegeType });

  if (!rank || !seatType || !gender || !collegeType) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const rankInt = parseInt(rank);

  const eligibleColleges = collegeData.filter(college => {
    const openingRank = college['Opening Rank'];
    const closingRank = college['Closing Rank'];
    const isEligible = (
      rankInt >= openingRank &&
       rankInt <= closingRank &&
      
       college['Gender'] === gender &&
       college['Seat Type'] === seatType &&  
       college['Institute Type'] === collegeType // Ensure Institute Type matches
    );
   
    return isEligible;
  });


  res.json({ eligibleColleges });
});

  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
