//enlace de endpoind
const usersULR = ".netlify/functions/users";

function guardar(event){
    event.preventDefault();
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    //variable estructurada transformando el frontend 
    const nombre = document.getElementById("nombre").value;
    const apellidos = document.getElementById("apellidos").value;
    const email = document.getElementById("email").value;
    const tipo = document.getElementById("tipo").value;
    const contrasena = document.getElementById("contrasena").value;
    const contrasenaC = document.getElementById("contrasenaC").value;

    if (contrasena !== contrasenaC) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    let newUser = JSON.stringify({
        "nombre": nombre,
        "apellidos": apellidos,
        "email": email,
        "tipo": tipo,
        "contrasena": contrasena
    });

    console.log(newUser);

    let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: newUser,
        redirect: "follow"
    };

    console.log(requestOptions);

    fetch(usersULR, requestOptions)
        .then((response) => response.text())
        .then((result) => {
            console.log("✅ Usuario registrado:", result);
            alert("✅ Usuario registrado correctamente.");
            document.getElementById("registro").reset();
        })
        .catch(error => {
            console.error("❌ Error al registrar:", error);
            alert("❌ Error al registrar usuario.");
        });

    //listar();
}

function editarUsuario(index) {
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  fetch(usersULR, requestOptions)
    .then(response => response.json())
    .then(users => {
      const user = users[index]; // obtenemos el usuario por índice
      if (!user) {
        alert("Usuario no encontrado.");
        return;
      }

      // Guardamos el índice para la actualización
      localStorage.setItem('editIndex', index);

      // Llenamos los campos del formulario de edición
      document.getElementById("nombreU").value = user.nombre;
      document.getElementById("apellidosU").value = user.apellidos;
      document.getElementById("emailU").value = user.email;
      document.getElementById("tipoU").value = user.tipo;
      document.getElementById("contrasenaU").value = user.contrasena;
      document.getElementById("contrasenaCU").value = user.contrasena;
    })
    .catch(error => {
      console.error("❌ Error al obtener usuario para editar:", error);
      alert("❌ No se pudo cargar la información del usuario.");
    });
}

function listar(event) {
  event.preventDefault();
  const userlist = document.getElementById("userlist");
  userlist.innerHTML = '';

  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  fetch(usersULR, requestOptions)
    .then((response) => response.json())
    .then((users) => {
      users.forEach((p, i) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>Usuario ${i + 1}</strong><br>
          Nombre: ${p.nombre}<br>
          Apellidos: ${p.apellidos}<br>
          Correo: ${p.email}<br>
          Tipo usuario: ${p.tipo}<br>
          <button type="button" onclick="editarUsuario(${i})">Editar</button>
          <button type="button" onclick="eliminarUsuario(${i})">Eliminar</button>
          <br><br>
        `;
        userlist.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("❌ Error al obtener usuarios:", error);
      alert("❌ Error al obtener usuarios.");
    });
}

function actualizar() {
  const index = localStorage.getItem('editIndex');
  if (index === null) {
    alert("Selecciona un usuario para modificar.");
    return;
  }

  const nombre = document.getElementById("nombreU").value;
  const apellidos = document.getElementById("apellidosU").value;
  const email = document.getElementById("emailU").value;
  const tipo = document.getElementById("tipoU").value;
  const contrasena = document.getElementById("contrasenaU").value;
  const contrasenaCU = document.getElementById("contrasenaCU").value;

  if (contrasena !== contrasenaCU) {
    alert("❌ Las contraseñas no coinciden.");
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const updatedUser = JSON.stringify({
    nombre: nombre,
    apellidos: apellidos,
    email: email,
    tipo: tipo,
    contrasena: contrasena
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: JSON.stringify({
      index: parseInt(index),
      usuario: JSON.parse(updatedUser)
    }),
    redirect: "follow"
  };

  fetch(usersULR, requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log("✅ Usuario actualizado:", result);
      alert("✅ Usuario actualizado correctamente.");
      localStorage.removeItem('editIndex');
      limpiarFormularioModificar();
      listar();
    })
    .catch(error => {
      console.error("❌ Error al actualizar usuario:", error);
      alert("❌ No se pudo actualizar el usuario.");
    });
}


function eliminarUsuario(index) {
  if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    body: JSON.stringify({ index: index }),
    redirect: "follow"
  };

  fetch(usersULR, requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log("🗑️ Usuario eliminado:", result);
      alert("🗑️ Usuario eliminado correctamente.");
      listar(); // Refresca la lista
    })
    .catch(error => {
      console.error("❌ Error al eliminar usuario:", error);
      alert("❌ No se pudo eliminar el usuario.");
    });
}

function limpiarFormularioModificar() {
  document.getElementById("nombreU").value = "";
  document.getElementById("apellidosU").value = "";
  document.getElementById("emailU").value = "";
  document.getElementById("tipoU").value = "";
  document.getElementById("contrasenaU").value = "";
  document.getElementById("contrasenaCU").value = "";
}