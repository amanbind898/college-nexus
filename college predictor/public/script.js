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
    const rank = parseInt(document.getElementById('rank').value);
    const seatType = document.getElementById('seatType').value;
    const collegeType = document.getElementById('collegeType').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const domicile = document.getElementById('domicile').value;
const eligiblemsg = document.getElementById('eligiblemsg');
    if (!rank || !seatType || !collegeType || !gender || !domicile) {
        alert("Please fill out all fields");
        return;
    }

    document.getElementById('spinner').style.display = 'block';

    fetch('http://localhost:3000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rank, seatType, collegeType, gender, domicile })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('spinner').style.display = 'none';
        displayResults(data.eligibleColleges, rank, domicile, collegeType);
    })
    .catch(error => {
        document.getElementById('spinner').style.display = 'none';
        console.error('Error:', error);
        alert('Error fetching data');
    });
}

function displayResults(colleges, userRank, domicile, collegeType) {
    const results = document.getElementById('results');
    const eligibleCount = document.getElementById('eligibleCount');
    results.innerHTML = '';
    eligibleCount.innerHTML = '';

    if (!colleges || !Array.isArray(colleges) || colleges.length === 0) {
        eligibleCount.innerHTML = 'No eligible colleges found for the given rank.';
        alert('No eligible colleges found for the given rank. Redirecting to the FAQ section for more information.');
        window.location.href = "#faq-section"; // Redirect to FAQ section
        return;
    }

    if (domicile === 'all') {
        eligibleCount.innerHTML = `Showing ${colleges.length} eligible options.`;
        const h4 = document.createElement('h4');
        h4.textContent = 'All colleges';
        eligibleCount.appendChild(h4);

        colleges.forEach(college => {
            const listItem = createCollegeListItem(college, userRank);
            results.appendChild(listItem);
        });
    } else {
        const homeStateColleges = colleges.filter(college => college['Quota'] === 'HS' && college['State'] === domicile);
        const otherStateColleges = colleges.filter(college => !(college['Quota'] === 'HS' && college['State'] === domicile));
        
        
        eligiblemsg.innerHTML = `Showing ${colleges.length} eligible options. The data is taken from the official JoSAA website and is updated till 2021 round 6.<br><br>` +
        `Please note:<br>` +
        `1. Since you have selected your home state (domicile) as ${domicile}, only HOME STATE (HS) quota colleges in ${domicile} are shown first. HS quota for other states is not displayed.<br>` +
        `2. If you do not see any colleges in your home state, it means you're not eligible for the colleges as per applied filters and CRL under HS quota. Eligible colleges from other states will be displayed if any.`;
    

        if (homeStateColleges.length > 0) {
            const homeStateHeader = document.createElement('h3');
            homeStateHeader.textContent = `Home State Colleges (${domicile})`;
            results.appendChild(homeStateHeader);

            homeStateColleges.forEach(college => {
                const listItem = createCollegeListItem(college, userRank);
                results.appendChild(listItem);
            });
        } else {
            const noHomeStateMsg = document.createElement('p');
            noHomeStateMsg.textContent = `No colleges found in your home state (${domicile}) under HOME STATE (HS) quota.`;
            results.appendChild(noHomeStateMsg);
        }

        if (otherStateColleges.length > 0) {
            const otherStateHeader = document.createElement('h3');
            otherStateHeader.textContent = 'Other State Colleges';
            results.appendChild(otherStateHeader);

            otherStateColleges.forEach(college => {
                const listItem = createCollegeListItem(college, userRank);
                results.appendChild(listItem);
            });
        }
    }
}

function createCollegeListItem(college, userRank) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <strong>${college['Institute Type']}</strong> - ${college['Institute']}
        <br>${college['Academic Program Name']}
        <br>Quota: ${college['Quota']}
        <br>Seat Type: ${college['Seat Type']}
        <br>Gender: ${college['Gender']}
        <br>Opening Rank: ${college['Opening Rank']}
        <br>Closing Rank: ${college['Closing Rank']}
    `;

    const probabilityTag = document.createElement('span');
    const probability = calculateProbability(parseInt(college['Opening Rank']), parseInt(college['Closing Rank']), userRank);
    probabilityTag.textContent = probability;
    probabilityTag.className = `probability-tag ${getProbabilityClass(probability)}`;

    listItem.appendChild(probabilityTag);

    return listItem;
}

function calculateProbability(openingRank, closingRank, userRank) {
    const range = closingRank - openingRank;
    const position = userRank - openingRank;

    if (position < 0) return 'Very High';
    if (position < range * 0.25) return 'High';
    if (position < range * 0.75) return 'Medium';
    return 'Low';
}

function getProbabilityClass(probability) {
    switch (probability) {
        case 'Very High':
            return 'very-high-probability';
        case 'High':
            return 'high-probability';
        case 'Medium':
            return 'medium-probability';
        case 'Low':
            return 'low-probability';
        default:
            return '';
    }
}