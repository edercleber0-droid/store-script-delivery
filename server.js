const express = require("express");
const fs = require("fs");
const axios = require("axios");

const app = express();

// 🔐 SUA SENHA
const PASSWORD = "junior-hub-key-321";

// 🔍 VERIFICA NA API DE KEYS
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

// 🌐 STATUS
app.get("/", (req, res) => {
  res.send("SCRIPT DELIVERY ONLINE ✔");
});

// 🔐 ROTA PROTEGIDA
app.get("/script", async (req, res) => {
  const key = req.query.key;
  const userId = req.query.userId;
  const password = req.query.password;

  // 🔒 SENHA
  if (password !== PASSWORD) {
    return res.send("SENHA INVALIDA");
  }

  if (!key || !userId) {
    return res.send("FALTA KEY OU USERID");
  }

  const result = await checkKey(key, userId);

  if (!result.valid) return res.send("ACESSO NEGADO");

  if (result.expired) return res.send("KEY EXPIRADA");

  if (result.reason === "used_by_other_user") {
    return res.send("KEY EM USO");
  }

  // 🔥 ENTREGA SCRIPT
  const script = fs.readFileSync("protected.lua", "utf8");

  res.send(script);
});

// 🚀 START
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("SCRIPT DELIVERY ONLINE:", PORT);
});