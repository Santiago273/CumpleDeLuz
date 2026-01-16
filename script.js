const API_URL = 'https://sheetdb.io/api/v1/1usixyvha4w93';

// Esta función es la que hace la "magia" de revisar antes de guardar
async function validarInvitado(nombreIngresado, apellidoIngresado, cantidadSolicitada) {
    try {
        // Buscamos en la hoja específica llamada ListaControl
        const response = await fetch(`${API_URL}?sheet=ListaControl`);
        const listaPermitida = await response.json();

        // Buscamos si existe el nombre y apellido en tu lista de control
        const coincidencia = listaPermitida.find(inv => 
            inv.nombre.toLowerCase().trim() === nombreIngresado.toLowerCase().trim() &&
            inv.apellido.toLowerCase().trim() === apellidoIngresado.toLowerCase().trim()
        );

        if (!coincidencia) {
            return { error: "No te encontramos en la lista. Revisa si escribiste bien tu nombre." };
        }

        if (parseInt(cantidadSolicitada) > parseInt(coincidencia.cupo)) {
            return { error: `Cupo excedido. Tu invitación es para máximo ${coincidencia.cupo} personas.` };
        }

        return { exito: true };
    } catch (err) {
        return { error: "Error de conexión. Intenta de nuevo." };
    }
}

// Aquí es donde se activa el formulario al darle clic al botón
const rsvpForm = document.getElementById('rsvpForm');
rsvpForm.onsubmit = async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('submitBtn');
    
    // Capturamos lo que escribió el usuario
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const integrantes = document.getElementById('integrantes').value;

    submitBtn.innerText = "VALIDANDO...";
    submitBtn.disabled = true;

    // PRIMERO: Validamos
    const resultado = await validarInvitado(nombre, apellido, integrantes);

    if (resultado.error) {
        alert(resultado.error);
        submitBtn.innerText = "CONFIRMAR";
        submitBtn.disabled = false;
        return; // Si hay error, el código se corta aquí y no guarda nada
    }

    // SEGUNDO: Si pasó la validación, guardamos en la hoja principal
    const datosFinales = {
        nombre: nombre,
        apellido: apellido,
        telefono: document.getElementById('telefono').value,
        integrantes: integrantes,
        fecha: new Date().toLocaleString()
    };

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "data": [datosFinales] })
        });
        alert("¡Confirmación exitosa!");
        document.getElementById('modal').style.display = "none";
        rsvpForm.reset();
    } catch (e) {
        alert("Error al guardar.");
    } finally {
        submitBtn.innerText = "CONFIRMAR";
        submitBtn.disabled = false;
    }
};