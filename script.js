const API_URL = 'https://sheetdb.io/api/v1/1usixyvha4w93';

document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('card');
    if (card) card.classList.add('visible');

    const modal = document.getElementById('modal');
    const openBtn = document.getElementById('openModalBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const rsvpForm = document.getElementById('rsvpForm');
    const statusMsg = document.getElementById('statusMsg');

    function mostrarMensaje(texto, tipo) {
        statusMsg.innerText = texto;
        statusMsg.className = "status-message " + (tipo === 'error' ? 'status-error' : 'status-success');
        statusMsg.style.display = "block";
    }

    if (openBtn) openBtn.onclick = () => { modal.style.display = "flex"; statusMsg.style.display = "none"; };
    if (closeBtn) closeBtn.onclick = () => modal.style.display = "none";

    rsvpForm.onsubmit = async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('submitBtn');
        const nombre = document.getElementById('nombre').value.trim();
        const apellido = document.getElementById('apellido').value.trim();
        const integrantes = document.getElementById('integrantes').value;

        submitBtn.innerText = "VERIFICANDO...";
        submitBtn.disabled = true;
        statusMsg.style.display = "none";

        try {
            // 1. Validar contra ListaControl
            const res = await fetch(`${API_URL}?sheet=ListaControl`);
            const lista = await res.json();

            const coincidencia = lista.find(inv => 
                inv.nombre.toLowerCase() === nombre.toLowerCase() && 
                inv.apellido.toLowerCase() === apellido.toLowerCase()
            );

            if (!coincidencia) {
                mostrarMensaje("No te encontramos en la lista de invitados.", "error");
            } else if (parseInt(integrantes) > parseInt(coincidencia.cupo)) {
                mostrarMensaje(`Tu invitación tiene un cupo máximo de ${coincidencia.cupo} personas.`, "error");
            } else {
                // 2. Guardar confirmación
                const data = { nombre, apellido, integrantes, telefono: document.getElementById('telefono').value, fecha: new Date().toLocaleString() };
                const save = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ "data": [data] })
                });

                if (save.ok) {
                    mostrarMensaje("¡Confirmación enviada! ✨ Te esperamos.", "success");
                    setTimeout(() => { modal.style.display = "none"; rsvpForm.reset(); }, 3000);
                }
            }
        } catch (err) {
            mostrarMensaje("Error de conexión. Intenta nuevamente.", "error");
        } finally {
            submitBtn.innerText = "ENVIAR";
            submitBtn.disabled = false;
        }
    };
});