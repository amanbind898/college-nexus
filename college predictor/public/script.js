console.log("script started");

function predictCollege() {
    const rank = document.getElementById('rank').value;
    const gender = document.getElementById('gender').value;
    const seatType = document.getElementById('seatType').value;

    if (!rank || !gender || !seatType) {
        alert("Please fill out all fields");
        return;
    }

    document.getElementById('spinner').style.display = 'block';

    fetch('https://college-nexus-lxtq.onrender.com/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rank: rank, gender: gender, seatType: seatType })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const results = document.getElementById('results');
        const eligibleCount = document.getElementById('eligibleCount');
        results.innerHTML = '';
        eligibleCount.innerHTML = '';
        document.getElementById('spinner').style.display = 'none';

        if (data.eligibleColleges.length === 0) {
            eligibleCount.innerHTML = 'No eligible colleges found for the given rank.';
        } else {
            eligibleCount.innerHTML = `${data.eligibleColleges.length} eligible options found:`;
            data.eligibleColleges.forEach(college => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <strong>${college['Institute']}</strong> - ${college['Academic Program Name']}
                    <br>Quota: ${college['Quota']}
                    <br>Seat Type: ${college['Seat Type']}
                    <br>Gender: ${college['Gender']}
                    <br>Opening Rank: ${college['Opening Rank']}
                    <br>Closing Rank: ${college['Closing Rank']}
                `;
                results.appendChild(listItem);
            });
        }
    })
    .catch(error => {
        document.getElementById('spinner').style.display = 'none';
        console.error('Error:', error);
        alert('Error fetching data');
    });
}

const printButtonContainer = document.getElementById('printButtonContainer');
if (!document.getElementById('printButton')) {
    const printButton = document.createElement('button');
    printButton.id = 'printButton';
    printButton.textContent = 'Print Results';
    printButton.onclick = printResults;
    printButtonContainer.appendChild(printButton);
}


function printResults() {
const originalContents = document.body.innerHTML;
const printContents = document.querySelector('.navbar').outerHTML +
                      document.querySelector('.container').outerHTML +
                      document.querySelector('.form-container').outerHTML +
                      document.getElementById('results').outerHTML;
document.body.innerHTML = printContents;
window.print();
document.body.innerHTML = originalContents;
location.reload();
}

