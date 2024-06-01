console.log("script started");
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-question');

    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('active');
            const answer = item.nextElementSibling;
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
            } else {
                answer.style.display = 'block';
            }
        });
    });
});

function predictCollege() {
    const rank = document.getElementById('rank').value;
    const seatType = document.getElementById('seatType').value;
    const collegeType = document.getElementById('collegeType').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;

    if (!rank || !seatType|| !collegeType || !gender) {
        alert("Please fill out all fields");
        return;
    }

    document.getElementById('spinner').style.display = 'block';

    fetch('https://college-nexus-lxtq.onrender.com/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rank, seatType,collegeType, gender })
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




