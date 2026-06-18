/* ============================================================
   MAIN.JS - Funciones compartidas por todas las páginas
   ============================================================ */

// ---- MODAL UTILITIES ----
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.modal-content').classList.remove('scale-95');
    }, 10);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('opacity-0');
    modal.querySelector('.modal-content').classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
        const form = modal.querySelector('form');
        if (form) form.reset();
    }, 250);
}

function closeModalOnOverlay(event) {
    if (event.target === event.currentTarget) {
        closeModal(event.target.id);
    }
}

// ---- CARGAR DATOS DEL USUARIO EN EL HEADER ----
function cargarDatosUsuarioHeader() {
    fetch('/api/usuario/perfil')
        .then(response => {
            if (!response.ok) { window.location.href = '/login'; throw new Error('No autenticado'); }
            return response.json();
        })
        .then(perfil => {
            const el = document.getElementById('nombre-usuario-header');
            if (el) el.textContent = perfil.nombre;
        })
        .catch(error => console.error('Error al cargar datos del usuario:', error));
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', function () {
    cargarDatosUsuarioHeader();
});
