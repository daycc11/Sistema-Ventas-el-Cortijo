/* ============================================================
   PERFIL.JS - Lógica de la página de perfil de usuario
   ============================================================ */

// ---- CARGAR DATOS DEL PERFIL ----
function cargarDatosPerfil() {
    fetch('/api/usuario/perfil')
        .then(response => {
            if (!response.ok) { window.location.href = '/login'; throw new Error('No autenticado'); }
            return response.json();
        })
        .then(perfil => {
            document.getElementById('perfil-nombre-completo').textContent = perfil.nombre + ' ' + perfil.apellido;
            document.getElementById('perfil-dni').value = perfil.nombreDeUsuario;
            document.getElementById('perfil-email').value = perfil.correoElectronico || '';
            document.getElementById('perfil-nombre').value = perfil.nombre;
            document.getElementById('perfil-apellido').value = perfil.apellido;
            document.getElementById('perfil-telefono').value = perfil.telefono || '';
            document.getElementById('perfil-direccion').value = perfil.direccion || '';
        })
        .catch(error => console.error('Error al cargar datos del perfil:', error));

    fetch('/api/usuario/actual')
        .then(r => r.json())
        .then(u => {
            const rolEl = document.getElementById('perfil-rol');
            if (rolEl) rolEl.textContent = u.roles.join(', ').replace(/ROLE_/g, '');
        });
}

// ---- INICIALIZACIÓN ----
document.addEventListener('DOMContentLoaded', function () {
    cargarDatosPerfil();

    // Guardar cambios de perfil
    document.getElementById('form-perfil').addEventListener('submit', function (e) {
        e.preventDefault();
        const perfilData = {
            nombre: document.getElementById('perfil-nombre').value,
            apellido: document.getElementById('perfil-apellido').value,
            telefono: document.getElementById('perfil-telefono').value,
            direccion: document.getElementById('perfil-direccion').value
        };

        fetch('/api/usuario/perfil', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(perfilData)
        }).then(response => {
            if (response.ok) {
                alert('Perfil actualizado exitosamente.');
                cargarDatosPerfil();
            } else {
                alert('Error al actualizar el perfil.');
            }
        });
    });

    // Cambiar contraseña
    document.getElementById('form-cambiar-password').addEventListener('submit', function (e) {
        e.preventDefault();
        const passwordData = {
            passwordActual: document.getElementById('password-actual').value,
            nuevaPassword: document.getElementById('password-nueva').value
        };

        fetch('/api/usuario/perfil/cambiar-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(passwordData)
        }).then(response => {
            response.text().then(mensaje => {
                alert(mensaje);
                if (response.ok) {
                    document.getElementById('form-cambiar-password').reset();
                }
            });
        });
    });
});
