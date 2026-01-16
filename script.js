const API_URL = 'https://sheetdb.io/api/v1/1usixyvha4w93';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mostrar la tarjeta
    const card = document.getElementById('card');
    if (card) {
        card.classList.add('visible');
    }

    // 2. Control del Modal
    const modal = document.getElementById('modal');
    const openBtn = document.getElementById('openModalBtn');
    const closeBtn = document.getElementById('closeModalBtn');

    if (openBtn && modal) {
        openBtn.onclick = () => modal.style.display = "flex";
    }
    if (closeBtn && modal) {
        closeBtn.onclick = () => modal.style.display = "none";
    }

    // 3. Validación y Envío
    const rsvpForm = document.getElementById('rsvpForm');
    if (rsvpForm) {
        rsvpForm.onsubmit = async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submitBtn');
            
            // Captura de datos
            const nombre = document.getElementById('nombre').value;
            const apellido = document.getElementById('apellido').value;
            const integrantes = document.getElementById('integrantes').value;
            const telefono = document.getElementById('telefono').value;

            submitBtn.innerText = "VERIFICANDO...";
            submitBtn.disabled = true;

            try {
                // Validación contra ListaControl
                const resValidar = await fetch(`${API_URL}?sheet=ListaControl`);
                const listaPermitida = await resValidar.json();

                const coincidencia = listaPermitida.find(inv => 
                    inv.nombre.toLowerCase().trim() === nombre.toLowerCase().trim() &&
                    inv.apellido.toLowerCase().trim() === apellido.toLowerCase().trim()
                );

                if (!coincidencia) {
                    alert("No estás en la lista de invitados.");
                } else if (parseInt(integrantes) > parseInt(coincidencia.cupo)) {
                    alert(`Tu cupo máximo es de ${coincidencia.cupo} personas.`);
                } else {
                    // Si todo está ok, guardar
                    const resGuardar = await fetch(API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ "data": [{
                            nombre, apellido, telefono, integrantes, fecha: new Date().toLocaleString()
                        }]})
                    });

                    if (resGuardar.ok) {
                        alert("¡Confirmación enviada!");
                        modal.style.display = "none";
                        rsvpForm.reset();
                    }
                }
            } catch (error) {
                console.error("Error detallado:", error);
                alert("Ocurrió un error. Revisa la consola.");
            } finally {
                submitBtn.innerText = "CONFIRMAR";
                submitBtn.disabled = false;
            }
        };
    }
});