// Insérez votre clé API ici
const API_KEY = 'd4fd114af61e4e8d910f91b4ec86448e'; 
const BASE_URL = 'https://v3.football.api-sports.io'; 

const matchContainer = document.getElementById('match-container');
const loading = document.getElementById('loading');

// Récupération des données depuis l'API
async function fetchFromAPI(endpoint) {
    loading.style.display = 'block';
    matchContainer.innerHTML = ''; // Réinitialiser l'affichage
    
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
        matchContainer.innerHTML = '<p>Impossible de charger les données depuis l\'API.</p>';
    } finally {
        loading.style.display = 'none';
    }
}

// Récupérer les matchs en direct (Live)
function fetchLiveMatches() {
    fetchFromAPI('/fixtures?live=all');
}

// Récupérer tous les matchs du jour (Calendrier)
function fetchAllMatches() {
    const aujourdhui = new Date().toISOString().split('T')[0]; 
    fetchFromAPI(`/fixtures?date=${aujourdhui}`);
}

// Afficher les matchs sur la page
function displayMatches(matches) {
    if (!matches || matches.length === 0) {
        matchContainer.innerHTML = '<p>Aucun match trouvé pour le moment.</p>';
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

// Lancer la recherche des matchs en direct au chargement de la page
window.onload = fetchLiveMatches;
