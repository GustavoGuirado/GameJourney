// ====== Seletores ======
const gameForm = document.getElementById("game-form");
const gameInput = document.getElementById("game-title");
const libraryContainer = document.getElementById("game-list");
const favoritesContainer = document.getElementById("favorites-list");

const btnLibrary = document.getElementById("btn-library");
const btnFavorites = document.getElementById("btn-favorites");

// ====== Constantes ======
const API_KEY = "3d75b2d15f0d4d38a955d8a1e80b99cc"; 
let library = JSON.parse(localStorage.getItem("library")) || [];
let currentTab = "library"; 

// ====== Utilidades ======
function saveLibrary() {
  localStorage.setItem("library", JSON.stringify(library));
}

function showMessage(container, message, type = "info") {
  container.innerHTML = `<p class="${type}-msg">${message}</p>`;
}

// ====== Renderização ======
function renderLibrary() {
  libraryContainer.innerHTML = "";
  favoritesContainer.innerHTML = "";

  const list = currentTab === "library" ? libraryContainer : favoritesContainer;
  const filtered = currentTab === "library"
    ? library.filter(g => !g.favorite)
    : library.filter(g => g.favorite);

  if (filtered.length === 0) {
    showMessage(list, "Nenhum jogo aqui ainda.", "empty");
  } else {
    filtered.forEach(game => {
      const card = document.createElement("li");
      card.className = "game-item";

      card.innerHTML = `
        <div class="game-card">
          <img class="game-cover" src="${game.background_image}" alt="${game.name}">
          <div class="game-title">${game.name}</div>
          <div class="actions">
            <button class="btn-fav ${game.favorite ? "favorited" : ""}">
              ${game.favorite ? "★" : "☆"}
            </button>
            <button class="btn-delete">🗑️</button>
          </div>
        </div>
      `;

      // Favoritar
      card.querySelector(".btn-fav").addEventListener("click", () => toggleFavorite(game));
      // Excluir
      card.querySelector(".btn-delete").addEventListener("click", () => deleteGame(game.id));

      list.appendChild(card);
    });
  }

  libraryContainer.style.display = currentTab === "library" ? "flex" : "none";
  favoritesContainer.style.display = currentTab === "favorites" ? "flex" : "none";
}

// ====== Ações ======
function toggleFavorite(game) {
  game.favorite = !game.favorite;
  saveLibrary();
  renderLibrary();
}

function deleteGame(id) {
  library = library.filter(g => g.id !== id);
  saveLibrary();
  renderLibrary();
}

// ====== Buscar jogos da API (apenas 1 vez) ======
async function fetchLibrary() {
  const initialized = localStorage.getItem("libraryInitialized");

  // Se já inicializou, apenas renderiza o que está salvo
  if (initialized) {
    renderLibrary();
    return;
  }

  try {
    showMessage(libraryContainer, "Carregando...", "loading");

    const res = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&page_size=10`);
    const data = await res.json();

    library = data.results.map(game => ({
      id: game.id,
      name: game.name,
      background_image: game.background_image || "https://via.placeholder.com/300x140?text=Sem+Imagem",
      favorite: false
    }));

    // Salva a biblioteca e marca como inicializada
    saveLibrary();
    localStorage.setItem("libraryInitialized", "true");

    renderLibrary();
  } catch (err) {
    console.error("Erro ao buscar biblioteca:", err);
    showMessage(libraryContainer, "Erro ao carregar jogos 😢", "error");
  }
}

// ====== Adicionar jogo pelo input ======
async function addGameByName(name) {
  try {
    const res = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(name)}&page_size=1`);
    const data = await res.json();

    if (data.results.length === 0) {
      alert("Jogo não encontrado.");
      return;
    }

    const game = data.results[0];

    if (!library.some(g => g.id === game.id)) {
      library.unshift({
        id: game.id,
        name: game.name,
        background_image: game.background_image || "https://via.placeholder.com/300x140?text=Sem+Imagem",
        favorite: false
      });
      saveLibrary();
    }

    renderLibrary();
    gameInput.value = "";
  } catch (err) {
    console.error("Erro ao adicionar jogo:", err);
  }
}

// ====== Eventos ======
btnLibrary.addEventListener("click", () => {
  currentTab = "library";
  renderLibrary();
  btnLibrary.classList.add("active");
  btnFavorites.classList.remove("active");
});

btnFavorites.addEventListener("click", () => {
  currentTab = "favorites";
  renderLibrary();
  btnLibrary.classList.remove("active");
  btnFavorites.classList.add("active");
});

gameForm.addEventListener("submit", e => {
  e.preventDefault();
  const name = gameInput.value.trim();
  if (name) addGameByName(name);
});

// ====== Inicialização ======
fetchLibrary();
