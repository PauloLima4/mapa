import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Configura banco
const file = path.join(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter, { empreendedores: [] }); // 👈 inicializa vazio caso não tenha nada

// Middlewares
app.use(cors());
app.use(express.json());

// Rota: listar empreendedores
app.get("/empreendedores", async (req, res) => {
  await db.read();
  res.json(db.data.empreendedores);
});

// Rota: adicionar empreendedor
app.post("/empreendedores", async (req, res) => {
  const novo = req.body;

  await db.read();
  novo.id = Date.now();
  db.data.empreendedores.push(novo);

  await db.write();
  res.status(201).json(novo);
});

// Rota: apagar por ID
app.delete("/empreendedores/:id", async (req, res) => {
  const id = Number(req.params.id);

  await db.read();
  db.data.empreendedores = db.data.empreendedores.filter((e) => e.id !== id);

  await db.write();
  res.json({ message: "Empreendedor removido com sucesso!" });
});

// Inicia servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
