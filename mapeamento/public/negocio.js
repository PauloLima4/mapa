const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  alert("ID do negócio não informado");
  window.location.href = "index.html";
}

fetch(`/api/empreendedores/${id}`)
  .then(res => {
    if (!res.ok) throw new Error("Negócio não encontrado");
    return res.json();
  })
  .then(emp => {
    document.getElementById("nome").textContent = emp.nome;
    document.getElementById("imagem").src = emp.imagem;
    document.getElementById("imagem").alt = emp.nome;
    document.getElementById("descricao").textContent = emp.descricao;
    document.getElementById("categoria").textContent = emp.categoria;
    document.getElementById("produto").textContent = emp.produto;
    document.getElementById("atendimento").textContent = emp.atendimento;
    document.getElementById("horario").textContent = emp.horario;

    // Endereço com link para Google Maps
    const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(emp.endereco)}`;
    const enderecoEl = document.getElementById("endereco");
    enderecoEl.href = gmapsUrl;
    enderecoEl.textContent = emp.endereco;

    // Contatos
    const telEl = document.getElementById("telefone");
    if (emp.contato && emp.contato.telefone) {
      telEl.href = `tel:${emp.contato.telefone}`;
      telEl.textContent = emp.contato.telefone;
    } else {
      telEl.textContent = "Não informado";
      telEl.removeAttribute("href");
    }

    const emailEl = document.getElementById("email");
    if (emp.contato && emp.contato.email) {
      emailEl.href = `mailto:${emp.contato.email}`;
      emailEl.textContent = emp.contato.email;
    } else {
      emailEl.textContent = "Não informado";
      emailEl.removeAttribute("href");
    }

    const whatsappEl = document.getElementById("whatsapp");
    if (emp.contato && emp.contato.whatsapp) {
      whatsappEl.href = `https://wa.me/${emp.contato.whatsapp}`;
      whatsappEl.textContent = emp.contato.whatsapp;
    } else {
      whatsappEl.textContent = "Não informado";
      whatsappEl.removeAttribute("href");
    }

    const instaEl = document.getElementById("instagram");
    if (emp.contato && emp.contato.instagram) {
      instaEl.href = `https://instagram.com/${emp.contato.instagram}`;
      instaEl.textContent = `@${emp.contato.instagram}`;
    } else {
      instaEl.textContent = "Não informado";
      instaEl.removeAttribute("href");
    }


    // Fotos extras
    const fotosExtrasDiv = document.getElementById("fotosExtras");
    fotosExtrasDiv.innerHTML = "";
    if (emp.fotosExtras && emp.fotosExtras.length > 0) {
      emp.fotosExtras.forEach(url => {
        const img = document.createElement("img");
        img.src = url;
        img.alt = emp.nome + " - foto extra";
        img.style.width = "150px";
        img.style.margin = "5px";
        fotosExtrasDiv.appendChild(img);
      });
    } else {
      fotosExtrasDiv.textContent = "Nenhuma foto extra disponível.";
    }

    // Loja virtual
    const lojaVirtualEl = document.getElementById("lojaVirtual");
    const lojaVirtualContainer = document.getElementById("lojaVirtualContainer");
    if (emp.lojaVirtual) {
      lojaVirtualEl.href = emp.lojaVirtual;
      lojaVirtualEl.textContent = emp.lojaVirtual;
    } else {
      lojaVirtualContainer.style.display = "none";
    }

    // Compartilhar WhatsApp
    document.getElementById("btnCompartilhar").onclick = () => {
      const texto = `Confira o negócio "${emp.nome}" - ${emp.descricao} - Contato: ${emp.contato.whatsapp || emp.contato.telefone || 'não informado'} - Endereço: ${emp.endereco}`;
      const url = encodeURIComponent(window.location.href);
      const msg = encodeURIComponent(texto + "\n" + url);
      window.open(`https://wa.me/?text=${msg}`, "_blank");
    };
  })
  .catch(err => {
    alert(err.message);
    window.location.href = "index.html";
  });
