const API_KEY = "3252e339408d4738bf8e0e80a7c85039";
const BASE_URL = "https://api.rawg.io/api/games";
const searchInput = document.getElementById("search-input");
const platformFilter = document.getElementById("platform-filter");
const sortFilter = document.getElementById("sort-filter");
const statusMessage = document.getElementById("status-message");
const resultsCount = document.getElementById("results-count");
const gamesContainer = document.getElementById("games-container");

function buildUrl() {
    const params = new URLSearchParams({
        key: API_KEY,
        page_size: "12",
        ordering: sortFilter.value
    });

    const searchValue = searchInput.value.trim();
    const platformValue = platformFilter.value;

    if (searchValue) {
        params.set("search", searchValue);
    }

    if (platformValue) {
        params.set("platforms", platformValue);
    }

    return `${BASE_URL}?${params.toString()}`;
}

function renderGames(games) {
    gamesContainer.innerHTML = "";

    if (!games.length) {
        gamesContainer.innerHTML = '<p class="empty-message">No games found.</p>';
        resultsCount.textContent = "0 results";
        return;
    }

    games.forEach((game) => {
        const platformNames = game.platforms?.map((item) => item.platform.name).join(", ") || "Not available";
        const card = document.createElement("article");

        card.className = "game-card";
        card.innerHTML = `
            <img class="game-image" src="${game.background_image || "https://via.placeholder.com/600x340?text=Game"}" alt="${game.name}">
            <div class="game-content">
                <h2>${game.name}</h2>
                <p><strong>Rating:</strong> ${game.rating ?? "N/A"}</p>
                <p><strong>Released:</strong> ${game.released || "Not available"}</p>
                <p><strong>Platforms:</strong> ${platformNames}</p>
            </div>
        `;

        gamesContainer.appendChild(card);
    });

    resultsCount.textContent = `${games.length} result${games.length === 1 ? "" : "s"}`;
}

async function fetchGames() {
    if (API_KEY === "YOUR_RAWG_API_KEY") {
        gamesContainer.innerHTML = "";
        resultsCount.textContent = "";
        statusMessage.textContent = "Add your RAWG API key in script.js to load games.";
        return;
    }

    statusMessage.textContent = "Loading games...";
    resultsCount.textContent = "";

    try {
        const response = await fetch(buildUrl());
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        renderGames(data.results || []);
        statusMessage.textContent = "Games loaded successfully.";
    } catch (error) {
        console.error("Error fetching games:", error);
        gamesContainer.innerHTML = "";
        resultsCount.textContent = "";
        statusMessage.textContent = "Unable to load games. Check your API key and internet connection.";
    }
}

searchInput.addEventListener("input", fetchGames);
platformFilter.addEventListener("change", fetchGames);
sortFilter.addEventListener("change", fetchGames);

fetchGames();
