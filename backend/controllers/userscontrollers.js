// Import the users data from the JSON file
const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, '../data/users.json');

// Helper function to read users from file
const getUsers = () => {
  try {
    const usersData = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(usersData);
  } catch (error) {
    return [];
  }
};

// Helper function to write users to file
const saveUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
};

// In-memory users array as requested
let users = getUsers();

// Controller for user operations
const usersController = {
  // Get all users
  getAll: (req, res) => {
    try {
      res.status(200).json({ success: true, users });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error retrieving users', error: error.message });
    }
  },

  // Register a new user
  register: (req, res) => {
    try {
      const { nombres, apellidos, email, tipoUsuario, nombreUsuario, password, confirmPassword } = req.body;

      // Validate all required fields
      if (!nombres || !apellidos || !email || !tipoUsuario || !nombreUsuario || !password || !confirmPassword) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
      }

      // Validate user type
      const validTypes = ['Gestor', 'Administrador', 'Personal de Aseo'];
      if (!validTypes.includes(tipoUsuario)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Tipo de usuario inválido. Debe ser: Gestor, Administrador o Personal de Aseo' 
        });
      }

      // Validate if passwords match
      if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Las contraseñas no coinciden' });
      }

      // Check if username already exists
      const usernameExists = users.some(user => user.nombreUsuario === nombreUsuario);
      if (usernameExists) {
        return res.status(400).json({ success: false, message: 'El nombre de usuario ya está en uso' });
      }

      // Check if email already exists
      const emailExists = users.some(user => user.email === email);
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'El correo electrónico ya está registrado' });
      }

      // Create new user object with ID
      const newUser = {
        id: Date.now().toString(),
        nombres,
        apellidos,
        email,
        tipoUsuario,
        nombreUsuario,
        password, // Note: In a real application, you should hash this password
        createdAt: new Date().toISOString()
      };

      // Add user to array
      users.push(newUser);
      saveUsers(users);

      // Return success without password
      const { password: _, ...userWithoutPassword } = newUser;
      res.status(201).json({ success: true, message: 'Usuario registrado exitosamente', user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error registrando usuario', error: error.message });
    }
  },

  // Login user
  login: (req, res) => {
    try {
      const { nombreUsuario, password } = req.body;

      // Validate required fields
      if (!nombreUsuario || !password) {
        return res.status(400).json({ success: false, message: 'Nombre de usuario y contraseña son requeridos' });
      }

      // Find user by username
      const user = users.find(u => u.nombreUsuario === nombreUsuario);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }

      // Verify password
      if (user.password !== password) {
        return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
      }

      // Return user data without password
      const { password: _, ...userWithoutPassword } = user;
      res.status(200).json({ success: true, message: 'Inicio de sesión exitoso', user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error en inicio de sesión', error: error.message });
    }
  },

  // Update user
  update: (req, res) => {
    try {
      const { id } = req.params;
      const { nombres, apellidos, email, tipoUsuario, nombreUsuario, password } = req.body;

      // Find user by ID
      const userIndex = users.findIndex(user => user.id === id);
      if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }

      // Check if username already exists (only if it's being changed)
      if (nombreUsuario && nombreUsuario !== users[userIndex].nombreUsuario) {
        const usernameExists = users.some((user, index) => index !== userIndex && user.nombreUsuario === nombreUsuario);
        if (usernameExists) {
          return res.status(400).json({ success: false, message: 'El nombre de usuario ya está en uso' });
        }
      }

      // Check if email already exists (only if it's being changed)
      if (email && email !== users[userIndex].email) {
        const emailExists = users.some((user, index) => index !== userIndex && user.email === email);
        if (emailExists) {
          return res.status(400).json({ success: false, message: 'El correo electrónico ya está registrado' });
        }
      }

      // Validate user type if it's being updated
      if (tipoUsuario) {
        const validTypes = ['Gestor', 'Administrador', 'Personal de Aseo'];
        if (!validTypes.includes(tipoUsuario)) {
          return res.status(400).json({ 
            success: false, 
            message: 'Tipo de usuario inválido. Debe ser: Gestor, Administrador o Personal de Aseo' 
          });
        }
      }

      // Update user
      users[userIndex] = {
        ...users[userIndex],
        nombres: nombres || users[userIndex].nombres,
        apellidos: apellidos || users[userIndex].apellidos,
        email: email || users[userIndex].email,
        tipoUsuario: tipoUsuario || users[userIndex].tipoUsuario,
        nombreUsuario: nombreUsuario || users[userIndex].nombreUsuario,
        password: password || users[userIndex].password,
        updatedAt: new Date().toISOString()
      };

      saveUsers(users);

      // Return updated user without password
      const { password: _, ...userWithoutPassword } = users[userIndex];
      res.status(200).json({ success: true, message: 'Usuario actualizado exitosamente', user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error actualizando usuario', error: error.message });
    }
  },

  // Delete user
  delete: (req, res) => {
    try {
      const { id } = req.params;

      // Find user by ID
      const userIndex = users.findIndex(user => user.id === id);
      if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }

      // Remove user from array
      const deletedUser = users.splice(userIndex, 1)[0];
      saveUsers(users);

      // Return success
      res.status(200).json({ success: true, message: 'Usuario eliminado exitosamente', userId: id });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error eliminando usuario', error: error.message });
    }
  },

  // Get user by ID
  getById: (req, res) => {
    try {
      const { id } = req.params;

      // Find user by ID
      const user = users.find(user => user.id === id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.status(200).json({ success: true, user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error recuperando usuario', error: error.message });
    }
  }
};

module.exports = usersController;