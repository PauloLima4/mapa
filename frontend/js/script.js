const centro = [-4.0432, -39.4545]; // General Sampaio
const limites = L.latLngBounds(
  L.latLng(-4.08, -39.50),
  L.latLng(-4.00, -39.40)
);

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

const fetchAndRender = () => {
  const busca = document.getElementById('search').value;
  const categoria = document.getElementById('categoriaFilter').value;
  const atendimento = document.getElementById('atendimentoFilter').value;

  let url = `/api/empreendedores?busca=${encodeURIComponent(busca)}&categoria=${encodeURIComponent(categoria)}&atendimento=${encodeURIComponent(atendimento)}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      // Remove marcadores antigos
      markers.forEach(m => map.removeLayer(m));
      markers = [];

      const cardsContainer = document.getElementById("cards");
      cardsContainer.innerHTML = "";

      data.forEach(emp => {
        // Adiciona marcador no mapa
        const m = L.marker([emp.lat, emp.lng]).addTo(map)
          .bindPopup(`<b>${emp.nome}</b><br>${emp.produto}`);
        m.on('click', () => {
          window.location.href = `negocio.html?id=${emp.id}`;
        });
        markers.push(m);

        // Cria card clicável
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
          <img src="${emp.imagem}" alt="${emp.nome}">
          <div class="card-content">
            <h3>${emp.nome}</h3>
            <p>${emp.produto}</p>
            <p><strong>Atendimento:</strong> ${emp.atendimento}</p>
          </div>
        `;
        card.onclick = () => {
          window.location.href = `negocio.html?id=${emp.id}`;
        }
        cardsContainer.appendChild(card);
      });
    });
};

document.getElementById("filterBtn").addEventListener("click", fetchAndRender);
document.getElementById("search").addEventListener("keydown", e => {
  if(e.key === "Enter") fetchAndRender();
});

window.onload = fetchAndRender;
