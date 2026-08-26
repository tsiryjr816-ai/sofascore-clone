// Apetraho eto ilay API Key anananao
const API_KEY = 'APETRAHO_ETO_NY_API_KEY_ANAO'; 
// Soloy arakaraka ny anaran'ilay API ny URL raha tsy API-Football izy ity
const BASE_URL = 'https://v3.football.api-sports.io'; 

const matchContainer = document.getElementById('match-container');
const loading = document.getElementById('loading');

// Fanaovana ny fangatahana (Fetch) amin'ny API
async function fetchFromAPI(endpoint) {
    loading.style.display = 'block';
    matchContainer.innerHTML = ''; // Fafana izay lalao teo aloha
    
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
        console.error('Nisy olana:', error);
        matchContainer.innerHTML = '<p>Tsy nahazo données avy amin\'ny API.</p>';
    } finally {
        loading.style.display = 'none';
    }
}

// Maka ny lalao mandeha mivantana (Live)
function fetchLiveMatches() {
    fetchFromAPI('/fixtures?live=all');
}

// Maka ny lalao rehetra anio (Kalandrie)
function fetchAllMatches() {
    // Afaka ovaina ny daty raha mila ny omaly na ny ampitso
    const androany = new Date().toISOString().split('T')[0]; 
    fetchFromAPI(`/fixtures?date=${androany}`);
}

// Asehoy eo amin'ny pejy ny lalao
function displayMatches(matches) {
    if (!matches || matches.length === 0) {
        matchContainer.innerHTML = '<p>Tsy misy lalao hita.</p>';
        return;
    }

    matches.forEach(match => {
        const matchElement = document.createElement('div');
        matchElement.classList.add('match-card');
        
        matchElement.innerHTML = `
            <div class="teams">
                <span><img src="${match.teams.home.logo}" width="20"> ${match.teams.home.name}</span>
                <span class="score">${match.goals.home ?? '-'} : ${match.goals.away ?? '-'}</span>
                <span>${match.teams.away.name} <img src="${match.teams.away.logo}" width="20"></span>
            </div>
            <div class="status">${match.fixture.status.long}</div>
        `;
        matchContainer.appendChild(matchElement);
    });
}

// Alefa avy hatrany ny lalao mivantana rehefa misokatra ny pejy
window.onload = fetchLiveMatches;
