const express = require("express");
const fs = require("fs");
const axios = require("axios");

const app = express();

const PASSWORD = "junior-hub-key-321";

// 🔍 verifica key na sua API
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

// 🔐 entrega script protegido
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

  // 🔥 envia seu script sem alterar nada
  const script = fs.readFileSync("protected.lua", "utf8");

  res.send(script);
});

app.listen(process.env.PORT || 3000);