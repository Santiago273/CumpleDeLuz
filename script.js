/**
 * CONFIGURACIÓN INICIAL
 * 1. Crea un Google Sheet con estos encabezados en la Fila 1: 
 * nombre, apellido, telefono, integrantes, fecha
 * 2. Pega tu API URL de SheetDB abajo.
 */
const API_URL = 'https://sheetdb.io/api/v1/1usixyvha4w93'; 

// --- 1. Animación de entrada ---
window.addEventListener('load', () => {
    const card = document.getElementById('card');
    if(card) card.classList.add('visible');
});

// --- 2. Manejo del Modal ---
const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const rsvpForm = document.getElementById('rsvpForm');

// Abrir modal
if (openModalBtn) {
    openModalBtn.onclick = () => {
        modal.style.display = "flex";
    };
}

// Cerrar modal al darle a "Cancelar"
if (closeModalBtn) {
    closeModalBtn.onclick = () => {
        modal.style.display = "none";
    };
}

// Cerrar modal si hacen clic fuera del recuadro blanco
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// --- 3. Envío de Datos a la Base de Datos (SheetDB) ---
if (rsvpForm) {
    rsvpForm.onsubmit = async (e) => {
        // Evitar que la página se recargue
        e.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        const originalBtnText = submitBtn.innerText;

        // Feedback visual: deshabilitar botón mientras envía
        submitBtn.innerText = "ENVIANDO...";
        submitBtn.disabled = true;

        // Capturar los datos del formulario
        const datos = {
            nombre: document.getElementById('nombre').value.trim(),
            apellido: document.getElementById('apellido').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            integrantes: document.getElementById('integrantes').value,
            fecha: new Date().toLocaleString('es-AR') // Fecha y hora local
        };

        try {
            // Petición a la API
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                // SheetDB requiere que los datos vayan dentro de un objeto "data"
                body: JSON.stringify({ "data": [datos] })
            });

            const result = await response.json();

            if (response.ok && result.created === 1) {
                // ÉXITO
                alert("¡Muchas gracias! Tu asistencia ha sido confirmada.");
                rsvpForm.reset();
                modal.style.display = "none";
            } else {
                // Error de la API (ej: nombres de columnas mal escritos)
                console.error("Error de SheetDB:", result);
                alert("Error al guardar: Verifica que las columnas en Google Sheets coincidan con los nombres del formulario.");
            }

        } catch (error) {
            // Error de red o conexión
            console.error("Error de red:", error);
            alert("No se pudo conectar con la base de datos. Revisa tu conexión a internet.");
        } finally {
            // Restaurar botón
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }
    };
}