import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const dbFile = path.join(__dirname, "db.json");
const adapter = new JSONFile(dbFile);
const db = new Low(adapter);

await db.read();
db.data = db.data || { empreendedores: [] };

app.get("/api/empreendedores", (req, res) => {
  let { busca = "", categoria = "", atendimento = "" } = req.query;
  busca = busca.toLowerCase();
  categoria = categoria.toLowerCase();
  atendimento = atendimento.toLowerCase();

  let resultados = db.data.empreendedores.filter(emp => {
    const nome = (emp.nome || "").toLowerCase();
    const produto = (emp.produto || "").toLowerCase();
    const descricao = (emp.descricao || "").toLowerCase();
    const empCategoria = (emp.categoria || "").toLowerCase();
    const empAtendimento = (emp.atendimento || "").toLowerCase();

    const matchBusca = nome.includes(busca) || produto.includes(busca) || descricao.includes(busca);
    const matchCategoria = categoria === "" || empCategoria === categoria;
    const matchAtendimento = atendimento === "" || empAtendimento.includes(atendimento);

    return matchBusca && matchCategoria && matchAtendimento;
  });

  res.json(resultados);
});

app.get("/api/empreendedores/:id", (req, res) => {
  const id = Number(req.params.id);
  const negocio = db.data.empreendedores.find(e => e.id === id);
  if (!negocio) {
    return res.status(404).json({ error: "Negócio não encontrado" });
  }
  res.json(negocio);
});

app.post("/api/empreendedores", async (req, res) => {
  const novo = req.body;

  if (!novo.nome || !novo.categoria) {
    return res.status(400).json({ error: "Nome e categoria são obrigatórios." });
  }

  const idNovo = db.data.empreendedores.length > 0
    ? Math.max(...db.data.empreendedores.map(e => e.id)) + 1
    : 1;

  const novoEmpreendedor = {
    id: idNovo,
    nome: novo.nome,
    categoria: novo.categoria,
    produto: novo.produto || "",
    descricao: novo.descricao || "",
    imagem: novo.imagem || "",
    lat: novo.lat,
    lng: novo.lng,
    endereco: novo.endereco || "",
    contato: {
      telefone: novo.telefone || "",
      email: novo.email || "",
      whatsapp: novo.whatsapp || "",
      instagram: novo.instagram || ""
    },
    horario: `${novo.horarioInicio || ""} às ${novo.horarioFim || ""}`,
    atendimento: novo.atendimento || "fisico",
    diasFuncionamento: novo.diasFuncionamento || [],
    lojaVirtual: novo.lojaVirtual ? novo.linkLojaVirtual || "" : "",
    fotosExtras: novo.fotosExtras || []
  };

  db.data.empreendedores.push(novoEmpreendedor);
  await db.write();

  res.status(201).json({ message: "Empreendedor cadastrado com sucesso!", empreendedor: novoEmpreendedor });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
