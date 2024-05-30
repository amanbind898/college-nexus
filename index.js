const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

let collegeData = [];

fs.createReadStream('college_data.csv')
  .pipe(csv())
  .on('data', (row) => {
    collegeData.push(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
    console.log('Loaded college data:', collegeData);
  });

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

app.post('/predict', (req, res) => {
  const { rank, gender, seatType } = req.body;
  console.log('Received data:', { rank,gender, seatType });

  if (!rank || !gender || !seatType) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const eligibleColleges = collegeData.filter(college => {
    const openingRank = parseInt(college['Opening Rank']);
    const closingRank = parseInt(college['Closing Rank']);
    return (
      rank >= openingRank &&
      rank <= closingRank &&
      college['Gender'] === gender &&
      college['Seat Type'] === seatType
    );
  });

  res.json({ eligibleColleges });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
