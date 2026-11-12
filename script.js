<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Registro de Personal</title>

<style>
body {
    font-family: Arial, sans-serif;
    background: #fff0f6;
    margin: 0;
    padding: 20px;
    color: #60364b;
}

header {
    background: #d85b91;
    color: white;
    text-align: center;
    padding: 25px;
    border-radius: 15px;
}

.contenedor {
    max-width: 1100px;
    margin: 25px auto;
}

.tarjeta {
    background: white;
    padding: 25px;
    border-radius: 15px;
    margin-bottom: 25px;
    box-shadow: 0 3px 12px #e8c3d3;
}

h2 {
    color: #c34d82;
}

.formulario {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
}

label {
    display: block;
    margin-bottom: 7px;
    font-weight: bold;
}

input, select {
    width: 100%;
    padding: 12px;
    border: 1px solid #e3a5bd;
    border-radius: 8px;
    box-sizing: border-box;
}

button {
    padding: 12px 18px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
}

.registrar {
    background: #d85b91;
    color: white;
}

.eliminar {
    background: #d9485b;
    color: white;
}

table {
    width: 100%;
    border-collapse: collapse;
    min-width: 800px;
}

th, td {
    padding: 12px;
    border: 1px solid #edc9d8;
    text-align: center;
}

th {
    background: #e8a0bd;
}

tr:nth-child(even) {
    background: #fff5f9;
}

.tabla {
    overflow-x: auto;
}

#mensaje {
    font-weight: bold;
    color: #bd4380;
}

@media(max-width: 650px) {
    .formulario {
        grid-template-columns: 1fr;
    }
}
</style>
</head>

<body>

<header>
    <h1>Salón de Belleza</h1>
    <p>Gestión y Registro de Personal</p>
</header>

<main class="contenedor">

<section class="tarjeta">

<h2>Registrar trabajador</h2>

<form id="formulario">

<div class="formulario">

<div>
<label>Nombre completo</label>
<input id="nombre" required>
</div>

<div>
<label>Teléfono</label>
<input id="telefono" type="tel" required>
</div>

<div>
<label>Carnet de identidad</label>
<input id="ci" required>
</div>

<div>
<label>Especialidad o cargo</label>
<select id="cargo" required>
<option value="">Seleccionar cargo</option>
<option>Estilista</option>
<option>Manicurista</option>
<option>Pedicurista</option>
<option>Cosmetóloga</option>
<option>Maquilladora</option>
<option>Recepcionista</option>
<option>Administradora</option>
<option>Otro</option>
</select>
</div>

<div>
<label>Fecha de ingreso</label>
<input id="fecha" type="date" required>
</div>

<div>
<label>Horario de trabajo</label>
<select id="horario" required>
<option value="">Seleccionar horario</option>
<option>Mañana</option>
<option>Tarde</option>
<option>Tiempo completo</option>
</select>
</div>

</div>

<br>

<button class="registrar" type="submit">
REGISTRAR TRABAJADOR
</button>

</form>

<p id="mensaje"></p>

</section>

<section class="tarjeta">

<h2>Personal registrado</h2>

<h3 id="total">Total de trabajadores: 0</h3>

<input id="buscar" placeholder="Buscar trabajador..." style="margin-bottom:20px">

<div class="tabla">

<table>

<thead>
<tr>
<th>Nombre</th>
<th>Teléfono</th>
<th>C.I.</th>
<th>Cargo</th>
<th>Ingreso</th>
<th>Horario</th>
<th>Acción</th>
</tr>
</thead>

<tbody id="listaPersonal"></tbody>

</table>

</div>

</section>

</main>

<script>

const formulario = document.getElementById("formulario");
const lista = document.getElementById("listaPersonal");
const mensaje = document.getElementById("mensaje");
const total = document.getElementById("total");
const buscar = document.getElementById("buscar");

const CLAVE = "personalSalonBTH";

let trabajadores = [];

try {
    trabajadores = JSON.parse(
        localStorage.getItem(CLAVE) || "[]"
    );

    if (!Array.isArray(trabajadores)) {
        trabajadores = [];
    }
} catch (error) {
    mensaje.textContent = "No se pudieron recuperar los registros.";
}

function guardar() {
    try {
        localStorage.setItem(
            CLAVE,
            JSON.stringify(trabajadores)
        );
        return true;
    } catch (error) {
        mensaje.textContent =
            "Error al guardar. Revisa el almacenamiento del navegador.";
        return false;
    }
}

function mostrarPersonal() {

    lista.innerHTML = "";

    const texto = buscar.value.toLowerCase().trim();

    const filtrados = trabajadores.filter(p =>
        p.nombre.toLowerCase().includes(texto) ||
        p.cargo.toLowerCase().includes(texto)
    );

    total.textContent =
        "Total de trabajadores: " + trabajadores.length;

    if (filtrados.length === 0) {

        const fila = document.createElement("tr");
        const celda = document.createElement("td");

        celda.colSpan = 7;
        celda.textContent = trabajadores.length === 0
            ? "Todavía no hay trabajadores registrados."
            : "No se encontraron trabajadores.";

        fila.appendChild(celda);
        lista.appendChild(fila);

        return;
    }

    filtrados.forEach(persona => {

        const fila = document.createElement("tr");

        [
            persona.nombre,
            persona.telefono,
            persona.ci,
            persona.cargo,
            persona.fecha,
            persona.horario
        ].forEach(valor => {

            const celda = document.createElement("td");
            celda.textContent = valor;
            fila.appendChild(celda);

        });

        const celdaAccion = document.createElement("td");
        const boton = document.createElement("button");

        boton.textContent = "Eliminar";
        boton.className = "eliminar";

        boton.addEventListener("click", () => {

            if (confirm("¿Deseas eliminar este trabajador?")) {

                trabajadores = trabajadores.filter(
                    p => p.id !== persona.id
                );

                if (guardar()) {
                    mensaje.textContent = "Trabajador eliminado.";
                    mostrarPersonal();
                }

            }

        });

        celdaAccion.appendChild(boton);
        fila.appendChild(celdaAccion);
        lista.appendChild(fila);

    });

}

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const persona = {
        id: Date.now().toString() + Math.random().toString(16).slice(2),
        nombre: document.getElementById("nombre").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
        ci: document.getElementById("ci").value.trim(),
        cargo: document.getElementById("cargo").value,
        fecha: document.getElementById("fecha").value,
        horario: document.getElementById("horario").value
    };

    if (Object.values(persona).some(v => !v)) {
        mensaje.textContent = "Completa todos los campos.";
        return;
    }

    trabajadores.push(persona);

    if (guardar()) {

        formulario.reset();

        buscar.value = "";

        mostrarPersonal();

        mensaje.textContent =
            "¡TRABAJADOR REGISTRADO CORRECTAMENTE!";

    } else {

        trabajadores.pop();

    }

});

buscar.addEventListener("input", mostrarPersonal);

mostrarPersonal();

</script>

</body>
</html>