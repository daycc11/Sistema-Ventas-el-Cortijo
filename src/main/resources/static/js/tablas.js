/* ============================================================
   TABLAS.JS - Lógica de las tablas CRUD (Productos, Clientes, Pedidos, Empleados)
   ============================================================ */

// ---- NAVEGACIÓN ENTRE SUB-TABLAS ----
function showManagedTable(tableName) {
    document.querySelectorAll('.managed-table-container').forEach(container => {
        container.classList.add('hidden');
    });
    document.getElementById(`table-container-${tableName}`).classList.remove('hidden');

    document.querySelectorAll('.tab-btn').forEach(button => {
        button.classList.remove('btn-primary');
        button.classList.add('bg-white', 'text-brand-text-title');
    });
    const activeButton = document.getElementById(`btn-show-${tableName}`);
    if (activeButton) {
        activeButton.classList.add('btn-primary');
        activeButton.classList.remove('bg-white', 'text-brand-text-title');
    }
}

// ---- TABLA PRODUCTOS ----
function renderTablaProductos() {
    const tbody = document.getElementById('tabla-productos-body');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="5" class="text-center p-8">Cargando productos...</td></tr>';

    fetch('/api/productos')
        .then(response => {
            if (!response.ok) throw new Error('Error de red');
            return response.json();
        })
        .then(productos => {
            tbody.innerHTML = '';
            if (productos.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center p-8">No hay productos registrados.</td></tr>';
                return;
            }
            productos.forEach(p => {
                const stockStatus = p.stock > 0
                    ? `<span class="status-badge status-badge-success">EN STOCK</span>`
                    : `<span class="status-badge status-badge-secondary">SIN STOCK</span>`;
                tbody.innerHTML += `<tr>
                    <td class="table-cell"><p class="font-bold text-brand-text-title">${p.nombre}</p></td>
                    <td class="table-cell">${p.tipoAlimento}</td>
                    <td class="table-cell"><p class="font-semibold">${p.stock}</p>${stockStatus}</td>
                    <td class="table-cell font-semibold">S/${p.precioUnitario.toFixed(2)}</td>
                    <td class="table-cell space-x-4">
                        <a href="#" class="font-bold text-brand-primary-blue" onclick="openEditModal(${p.idProducto})">Editar</a>
                        <a href="#" class="font-bold text-brand-danger" onclick="deleteItem('producto', ${p.idProducto})">Eliminar</a>
                    </td>
                </tr>`;
            });
        })
        .catch(error => {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center p-8 text-red-600">Error al cargar los productos.</td></tr>';
        });
}

// ---- TABLA CLIENTES ----
function renderTablaClientes() {
    const tbody = document.getElementById('tabla-clientes-body');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="5" class="text-center p-8">Cargando clientes...</td></tr>';

    fetch('/api/clientes')
        .then(response => response.json())
        .then(clientes => {
            tbody.innerHTML = '';
            if (clientes.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center p-8">No hay clientes registrados.</td></tr>';
                return;
            }
            clientes.forEach(c => {
                tbody.innerHTML += `<tr>
                    <td class="table-cell"><p class="font-bold text-brand-text-title">${c.nombre} ${c.apellido}</p></td>
                    <td class="table-cell">${c.dni}</td>
                    <td class="table-cell">${c.telefono}</td>
                    <td class="table-cell">${c.direccion}</td>
                    <td class="table-cell space-x-4">
                        <a href="#" class="font-bold text-brand-primary-blue" onclick="openEditClientModal(${c.idCliente})">Editar</a>
                        <a href="#" class="font-bold text-brand-danger" onclick="deleteItem('cliente', ${c.idCliente})">Eliminar</a>
                    </td>
                </tr>`;
            });
        })
        .catch(error => {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center p-8 text-red-600">Error al cargar los clientes.</td></tr>';
        });
}

// ---- TABLA PEDIDOS ----
function renderTablaPedidos() {
    const tbody = document.getElementById('tabla-pedidos-body');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="6" class="text-center p-8">Cargando pedidos...</td></tr>';

    fetch('/api/pedidos')
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar los pedidos');
            return response.json();
        })
        .then(pedidos => {
            tbody.innerHTML = '';
            if (pedidos.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center p-8">No hay pedidos registrados.</td></tr>';
                return;
            }
            pedidos.forEach(p => {
                const fechaFormateada = new Date(p.fecha + 'T00:00:00').toLocaleDateString('es-ES', {
                    day: '2-digit', month: '2-digit', year: 'numeric'
                });
                const horaFormateada = p.hora.substring(0, 5);
                tbody.innerHTML += `<tr>
                    <td class="table-cell font-bold text-brand-text-title">#${p.idPedido}</td>
                    <td class="table-cell">${p.nombreCliente}</td>
                    <td class="table-cell"><p>${fechaFormateada}</p><p class="text-xs">${horaFormateada}</p></td>
                    <td class="table-cell"><span class="status-badge bg-green-600 text-white rounded px-2 py-1">${p.nombreEstado}</span></td>
                    <td class="table-cell font-semibold">S/${p.total.toFixed(2)}</td>
                    <td class="table-cell space-x-4">
                        <a href="#" class="font-bold text-brand-primary-blue" onclick="openViewPedidoModal(${p.idPedido})">Ver</a>
                    </td>
                </tr>`;
            });
        })
        .catch(error => console.error('Error en Tabla Pedidos:', error));
}

// ---- TABLA EMPLEADOS ----
function renderTablaEmpleados() {
    const tbody = document.getElementById('tabla-empleados-body');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="5" class="text-center p-8">Cargando...</td></tr>';

    fetch('/api/empleados')
        .then(response => response.json())
        .then(empleados => {
            tbody.innerHTML = '';
            if (empleados.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center p-8">No hay empleados registrados.</td></tr>';
                return;
            }
            empleados.forEach(e => {
                tbody.innerHTML += `<tr>
                    <td class="table-cell"><p class="font-bold text-brand-text-title">${e.nombre} ${e.apellido}</p></td>
                    <td class="table-cell">${e.dni}</td>
                    <td class="table-cell">${e.nombreRol}</td>
                    <td class="table-cell">${e.telefono || 'N/A'}</td>
                    <td class="table-cell space-x-4">
                        <a href="#" class="font-bold text-brand-primary-blue" onclick="openEditEmployeeModal(${e.idEmpleado})">Editar</a>
                        <a href="#" class="font-bold text-brand-danger" onclick="deleteItem('empleado', ${e.idEmpleado})">Eliminar</a>
                    </td>
                </tr>`;
            });
        });
}

// ---- MODAL VER PEDIDO ----
function openViewPedidoModal(id) {
    const modalBody = document.getElementById('modal-pedido-body');
    modalBody.innerHTML = '<p class="text-center p-8">Cargando detalle del pedido...</p>';
    openModal('modal-ver-pedido');

    fetch(`/api/pedidos/${id}`)
        .then(response => {
            if (!response.ok) throw new Error('Pedido no encontrado');
            return response.json();
        })
        .then(pedido => {
            document.getElementById('modal-pedido-title').textContent = `Detalle del Pedido #${pedido.idPedido}`;
            let detallesHtml = '';
            pedido.detalles.forEach(d => {
                detallesHtml += `<tr class="border-b">
                    <td class="py-2 pr-2">${d.nombreProducto}</td>
                    <td class="py-2 pr-2 text-center">${d.cantidad}</td>
                    <td class="py-2 pr-2 text-right">S/${d.precioUnitarioVenta.toFixed(2)}</td>
                    <td class="py-2 pl-2 text-right font-semibold">S/${d.subtotal.toFixed(2)}</td>
                </tr>`;
            });
            modalBody.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p class="label-caps mb-1">Cliente</p>
                        <p class="font-bold text-brand-text-title">${pedido.nombreCliente}</p>
                        <p class="text-sm text-brand-text-secondary">DNI: ${pedido.dniCliente}</p>
                    </div>
                    <div class="text-left md:text-right">
                        <p class="label-caps mb-1">Vendedor</p>
                        <p class="font-bold text-brand-text-title">${pedido.nombreVendedor}</p>
                        <p class="label-caps mt-2 mb-1">Fecha</p>
                        <p class="text-sm text-brand-text-secondary">${new Date(pedido.fecha + 'T' + pedido.hora).toLocaleString('es-ES')}</p>
                    </div>
                </div>
                <div>
                    <p class="label-caps mb-2">Productos</p>
                    <table class="w-full text-sm">
                        <thead><tr class="border-b">
                            <th class="font-semibold text-left pb-2">Descripción</th>
                            <th class="font-semibold text-center pb-2">Cant.</th>
                            <th class="font-semibold text-right pb-2">P.U.</th>
                            <th class="font-semibold text-right pb-2">Subtotal</th>
                        </tr></thead>
                        <tbody>${detallesHtml}</tbody>
                    </table>
                </div>
                <div class="flex justify-end pt-4 border-t">
                    <div class="text-right">
                        <p class="label-caps">Total del Pedido</p>
                        <p class="text-2xl font-bold text-brand-text-title">S/${pedido.total.toFixed(2)}</p>
                    </div>
                </div>`;
        })
        .catch(() => {
            modalBody.innerHTML = '<p class="text-center p-8 text-red-600">No se pudo cargar el detalle del pedido.</p>';
        });
}

// ---- MODALES PRODUCTOS ----
function openNewProductModal() {
    document.getElementById('form-nuevo-producto').reset();
    document.getElementById('producto-id').value = '';
    document.getElementById('modal-title').textContent = 'Registrar Nuevo Producto';
    document.getElementById('modal-submit-button').textContent = 'Guardar Producto';
    openModal('modal-nuevo-producto');
}

function openEditModal(id) {
    fetch(`/api/productos/${id}`)
        .then(response => {
            if (!response.ok) throw new Error('Producto no encontrado');
            return response.json();
        })
        .then(producto => {
            document.getElementById('producto-id').value = producto.idProducto;
            document.getElementById('producto-nombre').value = producto.nombre;
            document.getElementById('producto-tipo').value = producto.tipoAlimento.idTipoAlimento;
            document.getElementById('producto-precio').value = producto.precioUnitario;
            document.getElementById('producto-stock').value = producto.stock;
            document.getElementById('modal-title').textContent = 'Editar Producto';
            document.getElementById('modal-submit-button').textContent = 'Guardar Cambios';
            openModal('modal-nuevo-producto');
        })
        .catch(() => alert('No se pudo cargar la información para editar.'));
}

// ---- MODALES CLIENTES ----
function openNewClientModal() {
    document.getElementById('form-nuevo-cliente').reset();
    document.getElementById('cliente-id').value = '';
    document.getElementById('modal-cliente-title').textContent = 'Registrar Nuevo Cliente';
    document.getElementById('modal-cliente-submit-button').textContent = 'Guardar Cliente';
    openModal('modal-nuevo-cliente');
}

function openEditClientModal(id) {
    fetch(`/api/clientes/${id}`)
        .then(response => response.json())
        .then(cliente => {
            document.getElementById('cliente-id').value = cliente.idCliente;
            document.getElementById('cliente-nombre').value = cliente.nombre;
            document.getElementById('cliente-apellido').value = cliente.apellido;
            document.getElementById('cliente-dni').value = cliente.dni;
            document.getElementById('cliente-telefono').value = cliente.telefono;
            document.getElementById('cliente-direccion').value = cliente.direccion;
            document.getElementById('modal-cliente-title').textContent = 'Editar Cliente';
            document.getElementById('modal-cliente-submit-button').textContent = 'Guardar Cambios';
            openModal('modal-nuevo-cliente');
        });
}

// ---- MODALES EMPLEADOS ----
function openNewEmployeeModal() {
    document.getElementById('form-nuevo-empleado').reset();
    document.getElementById('empleado-id').value = '';
    const passwordInput = document.getElementById('empleado-password');
    passwordInput.placeholder = 'Contraseña inicial requerida';
    passwordInput.required = true;
    document.getElementById('modal-empleado-title').textContent = 'Registrar Nuevo Empleado';
    document.getElementById('modal-empleado-submit-button').textContent = 'Guardar Empleado';
    openModal('modal-nuevo-empleado');
}

function openEditEmployeeModal(id) {
    fetch(`/api/empleados/${id}`)
        .then(response => response.json())
        .then(empleado => {
            document.getElementById('empleado-id').value = empleado.idEmpleado;
            document.getElementById('empleado-nombre').value = empleado.nombre;
            document.getElementById('empleado-apellido').value = empleado.apellido;
            document.getElementById('empleado-dni').value = empleado.dni;
            document.getElementById('empleado-telefono').value = empleado.telefono;
            document.getElementById('empleado-direccion').value = empleado.direccion;
            document.getElementById('empleado-fecha-nac').value = empleado.fechaNacimiento;
            document.getElementById('empleado-rol').value = empleado.rolEmpleado.idRolEmpleado;
            const passwordInput = document.getElementById('empleado-password');
            passwordInput.placeholder = 'Dejar en blanco para no cambiar';
            passwordInput.value = '';
            passwordInput.required = false;
            document.getElementById('modal-empleado-title').textContent = 'Editar Empleado';
            document.getElementById('modal-empleado-submit-button').textContent = 'Guardar Cambios';
            openModal('modal-nuevo-empleado');
        });
}

// ---- ELIMINAR ----
function deleteItem(type, id) {
    if (!confirm(`¿Estás seguro de que quieres eliminar este ${type}?`)) return;

    const urlMap = { producto: `/api/productos/${id}`, cliente: `/api/clientes/${id}`, empleado: `/api/empleados/${id}` };
    const callbackMap = {
        producto: () => { renderTablaProductos(); },
        cliente: () => { renderTablaClientes(); },
        empleado: renderTablaEmpleados
    };

    const url = urlMap[type];
    if (!url) return;

    fetch(url, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                callbackMap[type]();
                return;
            }
            return response.text().then(texto => { throw new Error(texto) });
        })
        .catch(error => alert(error.message));
}

// ---- CARGAR SELECTS ----
function cargarSelectTiposAlimento() {
    const select = document.getElementById('producto-tipo');
    if (!select) return;
    select.innerHTML = '<option value="">Cargando...</option>';

    fetch('/api/catalogos/tipos-alimento')
        .then(response => response.json())
        .then(tipos => {
            select.innerHTML = '<option value="">-- Seleccione un tipo --</option>';
            tipos.forEach(tipo => {
                select.innerHTML += `<option value="${tipo.idTipoAlimento}">${tipo.nombreTipoAlimento}</option>`;
            });
        })
        .catch(() => { select.innerHTML = '<option value="">Error al cargar</option>'; });
}

function cargarSelectRolesEmpleado() {
    const select = document.getElementById('empleado-rol');
    if (!select) return;

    fetch('/api/catalogos/roles-empleado')
        .then(response => response.json())
        .then(roles => {
            select.innerHTML = '<option value="">-- Seleccione un rol --</option>';
            roles.forEach(rol => {
                select.innerHTML += `<option value="${rol.idRolEmpleado}">${rol.nombreRol}</option>`;
            });
        });
}

// ---- INICIALIZACIÓN ----
document.addEventListener('DOMContentLoaded', function () {
    renderTablaProductos();
    renderTablaClientes();
    renderTablaPedidos();
    renderTablaEmpleados();
    cargarSelectTiposAlimento();
    cargarSelectRolesEmpleado();

    // Mostrar primera tabla por defecto
    showManagedTable('productos');

    // Form handlers
    document.getElementById('form-nuevo-producto').addEventListener('submit', function (e) {
        e.preventDefault();
        const productoId = document.getElementById('producto-id').value;
        const productoData = {
            nombre: document.getElementById('producto-nombre').value,
            idTipoAlimento: parseInt(document.getElementById('producto-tipo').value),
            precioUnitario: parseFloat(document.getElementById('producto-precio').value),
            stock: parseInt(document.getElementById('producto-stock').value)
        };
        const esEdicion = productoId !== '';
        const url = esEdicion ? `/api/productos/${productoId}` : '/api/productos';
        const method = esEdicion ? 'PUT' : 'POST';

        fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productoData) })
            .then(response => {
                if (!response.ok) throw new Error(`Error al ${esEdicion ? 'actualizar' : 'crear'} el producto`);
                return response.json();
            })
            .then(() => {
                renderTablaProductos();
                closeModal('modal-nuevo-producto');
            })
            .catch(error => alert(error.message));
    });

    document.getElementById('form-nuevo-cliente').addEventListener('submit', function (e) {
        e.preventDefault();
        const clienteId = document.getElementById('cliente-id').value;
        const clienteData = {
            nombre: document.getElementById('cliente-nombre').value,
            apellido: document.getElementById('cliente-apellido').value,
            dni: document.getElementById('cliente-dni').value,
            telefono: document.getElementById('cliente-telefono').value,
            direccion: document.getElementById('cliente-direccion').value,
        };
        const esEdicion = clienteId !== '';
        const url = esEdicion ? `/api/clientes/${clienteId}` : '/api/clientes';
        const method = esEdicion ? 'PUT' : 'POST';

        fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(clienteData) })
            .then(response => {
                if (!response.ok) return response.text().then(txt => { throw new Error(txt); });
                return response.json();
            })
            .then(() => {
                renderTablaClientes();
                closeModal('modal-nuevo-cliente');
            })
            .catch(error => alert(error.message));
    });

    document.getElementById('form-nuevo-empleado').addEventListener('submit', function (e) {
        e.preventDefault();
        const empleadoId = document.getElementById('empleado-id').value;
        const password = document.getElementById('empleado-password').value;
        if (!empleadoId && !password) {
            alert('Por favor, ingrese una contraseña para el nuevo empleado.');
            return;
        }
        const empleadoData = {
            dni: document.getElementById('empleado-dni').value,
            nombre: document.getElementById('empleado-nombre').value,
            apellido: document.getElementById('empleado-apellido').value,
            password: password,
            fechaNacimiento: document.getElementById('empleado-fecha-nac').value,
            telefono: document.getElementById('empleado-telefono').value,
            direccion: document.getElementById('empleado-direccion').value,
            idRolEmpleado: parseInt(document.getElementById('empleado-rol').value),
        };
        const esEdicion = empleadoId !== '';
        const url = esEdicion ? `/api/empleados/${empleadoId}` : '/api/empleados';
        const method = esEdicion ? 'PUT' : 'POST';

        fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(empleadoData) })
            .then(response => {
                if (response.ok) return response.json();
                return response.text().then(txt => { throw new Error(txt) });
            })
            .then(() => {
                renderTablaEmpleados();
                closeModal('modal-nuevo-empleado');
            })
            .catch(error => alert(error.message));
    });
});
