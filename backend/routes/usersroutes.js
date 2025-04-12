const express = require("express");
const router = express.Router();
const usercontroller = require("../controllers/userscontrollers.js");

router.get("/", usercontroller.consultar);
router.post("/", usercontroller.ingresar);
router.put("/", usercontroller.actualizar);
router.delete("/", usercontroller.borrar);

module.exports = router;
