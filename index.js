const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

let collegeData = [];

const csvFilePath = path.join(__dirname, 'orcrdata.csv');

// Read and parse the CSV file
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
  const { rank, seatType, gender, collegeType, domicile } = req.body;
  console.log('Received data:', { rank, seatType, gender, collegeType, domicile });

  if (!rank || !seatType || !gender || !collegeType || !domicile) {
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
      (collegeType === 'all' || college['Institute Type'] === collegeType)
    );

    return isEligible;
  });

  console.log('Eligible colleges before domicile filter:', eligibleColleges.length);

  let homeStateColleges = [];
  let otherColleges = eligibleColleges;

  if (domicile !== 'all') {
    homeStateColleges = eligibleColleges.filter(college =>
      college['Quota'] === 'HS' && college['State'] === domicile
    );

    otherColleges = eligibleColleges.filter(college =>
      college['Quota'] !== 'HS' || college['State'] !== domicile
    );
  }

  const sortedColleges = [...homeStateColleges, ...otherColleges];

  console.log('Home state colleges:', homeStateColleges.length);
  console.log('Other state colleges:', otherColleges.length);

  const response = {
    eligibleColleges: sortedColleges,
    message: ''
  };

  

  res.json(response);
});
setInterval(() => {
  console.log('Pinging server to keep it awake');
  fetch('https://college-nexus-lxtq.onrender.com/predict')
    .then(res => res.text())
    .then(body => console.log('Pinged server, response:', body))
    .catch(err => console.error('Error pinging server:', err));
}, 1500000); // Ping every 25 minutes

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
