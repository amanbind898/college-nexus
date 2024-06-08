console.log("script started");
document.addEventListener('DOMContentLoaded', () => {
    const icon = document.querySelector('.logo');
    icon.addEventListener('click', () => {
        location.href = "/index.html";
       

    }
    );
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
                <strong id="rd">${college['Institute Type']}</strong>
                <strong class="institute-name">${college['Institute']}</strong> - ${college['Academic Program Name']}
                <br><span class="detail">Quota:</span> ${college['Quota']}
                <br><span class="detail">Seat Type:</span> ${college['Seat Type']}
                <br><span class="detail">Gender:</span> ${college['Gender']}
                <br><span class="detail">Opening Rank:</span> ${college['Opening Rank']}
                <br><span class="detail">Closing Rank:</span> ${college['Closing Rank']}
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




