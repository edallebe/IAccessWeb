const { Console } = require("console");
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data/users.json");

class UserController {

    consultar(req, res) {
        try {
            if (!fs.existsSync(dataPath)) {
                fs.writeFileSync(dataPath, JSON.stringify([]));
            }
    
            const data = fs.readFileSync(dataPath, "utf-8"); // asegúrate de leer como texto
            const users = JSON.parse(data);
    
            console.log("📄 Usuarios consultados:", users); // para verificar qué se envía
            res.status(200).json(users);
        } catch (err) {
            console.error("❌ Error al consultar usuarios:", err.message);
            res.status(500).send(err.message);
        }
    }
    

    ingresar(req, res) {
        try {
            let body = req.body;
            console.log(body);
    
            // Si aún viene como Buffer, conviértelo a string y parsea
            if (Buffer.isBuffer(body)) {
                body = JSON.parse(body.toString("utf8"));
            }
    
            const { nombre, apellidos, email, tipo, contrasena } = body;
    
            if (!nombre || !apellidos || !email || !tipo || !contrasena) {
                return res.status(400).send("Faltan datos del usuario");
            }
    
            const newUser = { nombre, apellidos, email, tipo, contrasena };
    
            let users = [];
            if (fs.existsSync(dataPath)) {
                const fileData = fs.readFileSync(dataPath, "utf8");
                users = fileData ? JSON.parse(fileData) : [];
            }
    
            users.push(newUser);
            fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
    
            res.status(200).send("Usuario agregado correctamente");
        } catch (err) {
            console.error("❌ Error al ingresar usuario:", err.message);
            res.status(500).send("Error interno del servidor");
        }
    }
    
    

    actualizar(req, res) {
        try {
            const { index, usuario } = req.body;
            const users = JSON.parse(fs.readFileSync(dataPath));

            if (index < 0 || index >= users.length) {
                return res.status(400).send("Índice inválido");
            }

            users[index] = usuario;
            fs.writeFileSync(dataPath, JSON.stringify(users));

            res.status(200).send("Usuario actualizado correctamente");
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    borrar(req, res) {
        try {
            const { index } = req.body;
            const users = JSON.parse(fs.readFileSync(dataPath));

            if (index < 0 || index >= users.length) {
                return res.status(400).send("Índice inválido");
            }

            users.splice(index, 1);
            fs.writeFileSync(dataPath, JSON.stringify(users));

            res.status(200).send("Usuario eliminado correctamente");
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
}

module.exports = new UserController();
