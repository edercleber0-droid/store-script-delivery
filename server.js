const express = require("express");
const fs = require("fs");
const axios = require("axios");

const app = express();

const PASSWORD = "junior-hub-key-321";

// 🔍 verifica key na sua API principal
async function checkKey(key, userId) {
  try {
    const res = await axios.get(
      `https://store-key-system.onrender.com/check?key=${key}&userId=${userId}`
    );
    return res.data;
  } catch {
    return { valid: false };
  }
}

// 🌐 rota principal (pra evitar "Cannot GET /")
app.get("/", (req, res) => {
  res.send("SCRIPT DELIVERY ONLINE ✔");
});

// 🔐 rota protegida
app.get("/script", async (req, res) => {
  const { key, userId, password } = req.query;

  if (password !== PASSWORD) {
    return res.send("ACESSO NEGADO");
  }

  if (!key || !userId) {
    return res.send("FALTA DADOS");
  }

  const result = await checkKey(key, userId);

  if (!result.valid) return res.send("KEY INVALIDA");
  if (result.expired) return res.send("KEY EXPIRADA");
  if (result.reason === "used_by_other_user") {
    return res.send("KEY EM USO");
  }

  // 🔥 entrega script
  const script = fs.readFileSync("protected.lua", "utf8");

  res.send(script);
});

// 🚀 start
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("SCRIPT DELIVERY ONLINE:", PORT);
});