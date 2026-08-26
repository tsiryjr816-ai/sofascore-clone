const API_KEY = 'd4fd114af61e4e8d910f91b4ec86448e';
const BASE_URL = 'https://v3.football.api-sports.io';

const matchContainer = document.getElementById('match-container');
const loading = document.getElementById('loading');
const datePicker = document.getElementById('date-picker');
const btnLive = document.getElementById('btn-live');

let liveInterval = null;

function stopAutoRefresh() {
    if (liveInterval) {
        clearInterval(liveInterval);
        liveInterval = null;
    }
}

function startLiveAutoRefresh() {
    stopAutoRefresh();
    btnLive.classList.add('active');
    fetchLiveMatches();
    liveInterval = setInterval(fetchLiveMatches, 60000); // Renewal isaky ny 60 segondra
}

function fetchMatchesByDate(selectedDate) {
    stopAutoRefresh();
    btnLive.classList.remove('active');
    if (!selectedDate) return;
    fetchFromAPI(`/fixtures?date=${selectedDate}`);
}

function fetchLiveMatches() {
    fetchFromAPI('/fixtures?live=all');
}

async function fetchFromAPI(endpoint) {
    loading.style.display = 'block';
    
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': API_KEY,
                'x-rapidapi-host': 'v3.football.api-sports.io'
            }
        });
        const data = await response.json();
        displayMatches(data.response);
    } catch (error) {
        console.error('Erreur :', error);
        matchContainer.innerHTML = '<p class="loading-spinner">Erreur lors de la récupération des données.</p>';
    } finally {
        loading.style.display = 'none';
    }
}

function displayMatches(matches) {
    matchContainer.innerHTML = '';

    if (!matches || matches.length === 0) {
        matchContainer.innerHTML = '<p class="loading-spinner">Aucun match disponible.</p>';
        return;
    }

    matches.forEach(match => {
        const matchCard = document.createElement('div');
        matchCard.classList.add('match-card');
        matchCard.onclick = () => openMatchDetails(match.fixture.id);

        const statusText = match.fixture.status.elapsed 
            ? `${match.fixture.status.short} ${match.fixture.status.elapsed}'` 
            : match.fixture.status.long;

        matchCard.innerHTML = `
            <div class="teams">
                <div class="team-row">
                    <img src="${match.teams.home.logo}" alt="${match.teams.home.name}">
                    <span>${match.teams.home.name}</span>
                </div>
                <div class="team-row">
                    <img src="${match.teams.away.logo}" alt="${match.teams.away.name}">
                    <span>${match.teams.away.name}</span>
                </div>
            </div>
            <div class="score-box">
                <div>${match.goals.home ?? '-'} - ${match.goals.away ?? '-'}</div>
                <div class="status">${statusText}</div>
            </div>
        `;
        matchContainer.appendChild(matchCard);
    });
}

// Fisintonana ny statistique rehefa kitihina ny match iray
async function openMatchDetails(fixtureId) {
    const modal = document.getElementById('match-modal');
    const detailsDiv = document.getElementById('modal-details');
    modal.style.display = 'flex';
    detailsDiv.innerHTML = 'Chargement des statistiques...';

    try {
        const response = await fetch(`${BASE_URL}/fixtures/statistics?fixture=${fixtureId}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': API_KEY,
                'x-rapidapi-host': 'v3.football.api-sports.io'
            }
        });
        const data = await response.json();
        
        if (!data.response || data.response.length === 0) {
            detailsDiv.innerHTML = '<p>Aucune statistique disponible pour ce match.</p>';
            return;
        }

        const team1 = data.response[0];
        const team2 = data.response[1];

        let html = `<h3>Statistiques du Match</h3><br>`;
        html += `<p style="text-align:center;"><strong>${team1.team.name} vs ${team2.team.name}</strong></p><br><hr><br>`;
        
        team1.statistics.forEach((stat, index) => {
            const stat2Value = team2.statistics[index]?.value ?? 0;
            html += `<div style="display:flex; justify-content:space-between; margin: 6px 0;">
                <span>${stat.value ?? 0}</span>
                <span><strong>${stat.type}</strong></span>
                <span>${stat2Value}</span>
            </div>`;
        });

        detailsDiv.innerHTML = html;
    } catch (err) {
        detailsDiv.innerHTML = '<p>Erreur lors du chargement des détails.</p>';
    }
}

function closeModal(event) {
    if (event.target.id === 'match-modal') {
        document.getElementById('match-modal').style.display = 'none';
    }
}

function closeModalDirect() {
    document.getElementById('match-modal').style.display = 'none';
}

// Alefa avy hatrany rehefa misokatra ny pejy
window.onload = () => {
    const today = new Date().toISOString().split('T')[0];
    datePicker.value = today;
    startLiveAutoRefresh();
};
