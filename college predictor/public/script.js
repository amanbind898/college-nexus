console.log("script started");

function predictCollege() {
    const rank = document.getElementById('rank').value;

    fetch('http://localhost:3000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rank: rank })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const results = document.getElementById('results');
        results.innerHTML = '';

        if (data.eligibleColleges.length === 0) {
            results.innerHTML = '<li>No eligible colleges found for the given rank.</li>';
        } else {
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
        console.error('Error:', error);
    });
}
