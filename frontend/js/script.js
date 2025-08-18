const centro = [-4.0432, -39.4545]; // General Sampaio
const limites = L.latLngBounds(
  L.latLng(-4.08, -39.50),
  L.latLng(-4.00, -39.40)
);

// Inicializa o mapa
let map = L.map("map", {
  center: centro,
  zoom: 14,
  maxBounds: limites,
  maxBoundsViscosity: 1.0
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
}).addTo(map);

let markers = [];

// Função para buscar dados da API e renderizar mapa + cards
const fetchAndRender = () => {
  const busca = document.getElementById('search').value;
  const categoria = document.getElementById('categoriaFilter').value;
  const atendimento = document.getElementById('atendimentoFilter').value;

  const url = `http://localhost:3000/api/empreendedores?busca=${encodeURIComponent(busca)}&categoria=${encodeURIComponent(categoria)}&atendimento=${encodeURIComponent(atendimento)}`;

  const cardsContainer = document.getElementById("cards");

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Erro ao acessar a API");
      return res.json();
    })
    .then(data => {
      // Remove marcadores antigos
      markers.forEach(m => map.removeLayer(m));
      markers = [];

      cardsContainer.innerHTML = "";

      if (!Array.isArray(data) || data.length === 0) {
        cardsContainer.innerHTML = "<p>Nenhuma empresa cadastrada.</p>";
        return;
      }

      data.forEach(emp => {
        // Adiciona marcador no mapa
        const lat = parseFloat(emp.lat) || centro[0];
        const lng = parseFloat(emp.lng) || centro[1];
        const m = L.marker([lat, lng]).addTo(map)
          .bindPopup(`<b>${emp.nome}</b><br>${emp.produto || 'Não informado'}`);
        m.on('click', () => window.location.href = `negocio.html?id=${emp.id}`);
        markers.push(m);

        // Cria card clicável
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
          <img src="${emp.imagem || 'img/default.png'}" alt="${emp.nome}">
          <div class="card-content">
            <h3>${emp.nome}</h3>
            <p>${emp.produto || 'Não informado'}</p>
            <p><strong>Atendimento:</strong> ${emp.atendimento || 'Não informado'}</p>
          </div>
        `;
        card.onclick = () => window.location.href = `negocio.html?id=${emp.id}`;
        cardsContainer.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Erro ao carregar empresas:", err);
    });
};

// Eventos de filtro
document.getElementById("filterBtn").addEventListener("click", fetchAndRender);
document.getElementById("search").addEventListener("keydown", e => {
  if (e.key === "Enter") fetchAndRender();
});

// Carrega os dados ao abrir a página
window.onload = fetchAndRender;
