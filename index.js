const express = require('express');
const cors = require("cors");
const serverless = require('serverless-http'); // si usas Netlify
const usersroutes = require("./backend/routes/usersroutes.js");

const app = express();
app.use(cors());
app.use(express.json()); // ⚠️ Este middleware debe ir ANTES de tus rutas

app.use("/users", usersroutes); // ← las rutas vienen después del middleware

app.get("/", (req, res) => {
    res.send("Hola mundo");
});

app.listen(8888, () => {
    console.log("✅ Servidor activo");
});
