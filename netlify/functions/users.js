const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

const app = express();
const usersroutes = require("../../backend/routes/usersroutes.js");

app.use(cors());
app.use(express.json());

const router = express.Router();
router.use("/users", usersroutes);

app.use("/.netlify/functions", router);

module.exports.handler = serverless(app);
