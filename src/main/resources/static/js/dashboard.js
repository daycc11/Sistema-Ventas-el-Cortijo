/* ============================================================
   DASHBOARD.JS - Lógica exclusiva del Dashboard
   ============================================================ */

// ---- TABLA DE PEDIDOS RECIENTES (últimos 5) ----
function renderTablaPedidosDashboard() {
    const tbody = document.getElementById('tabla-pedidos-dashboard-body');
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

            const pedidosRecientes = pedidos.slice(0, 5);
            pedidosRecientes.forEach(p => {
                const fechaFormateada = new Date(p.fecha + 'T00:00:00').toLocaleDateString('es-ES', {
                    day: '2-digit', month: '2-digit', year: 'numeric'
                });
                const horaFormateada = p.hora.substring(0, 5);

                tbody.innerHTML += `<tr>
                    <td class="table-cell font-bold text-brand-text-title">#${p.idPedido}</td>
                    <td class="table-cell">${p.nombreCliente}</td>
                    <td class="table-cell">
                        <p>${fechaFormateada}</p>
                        <p class="text-xs">${horaFormateada}</p>
                    </td>
                    <td class="table-cell">
                        <span class="status-badge bg-green-600 text-white rounded px-2 py-1">${p.nombreEstado}</span>
                    </td>
                    <td class="table-cell font-semibold">S/${p.total.toFixed(2)}</td>
                    <td class="table-cell space-x-4">
                        <a href="#" class="font-bold text-brand-primary-blue" onclick="openViewPedidoModal(${p.idPedido})">Ver</a>
                    </td>
                </tr>`;
            });
        })
        .catch(error => console.error('Error en Dashboard:', error));
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
                detallesHtml += `
                    <tr class="border-b">
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
                        <p class="text-sm text-brand-text-secondary">${pedido.direccionCliente}</p>
                    </div>
                    <div class="text-left md:text-right">
                        <p class="label-caps mb-1">Vendedor</p>
                        <p class="font-bold text-brand-text-title">${pedido.nombreVendedor}</p>
                        <p class="label-caps mt-2 mb-1">Fecha y Hora</p>
                        <p class="text-sm text-brand-text-secondary">${new Date(pedido.fecha + 'T' + pedido.hora).toLocaleString('es-ES')}</p>
                    </div>
                </div>
                <div>
                    <p class="label-caps mb-2">Productos</p>
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b">
                                <th class="font-semibold text-left pb-2">Descripción</th>
                                <th class="font-semibold text-center pb-2">Cant.</th>
                                <th class="font-semibold text-right pb-2">P.U.</th>
                                <th class="font-semibold text-right pb-2">Subtotal</th>
                            </tr>
                        </thead>
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
        .catch(error => {
            console.error('Error al cargar detalle del pedido:', error);
            modalBody.innerHTML = '<p class="text-center p-8 text-red-600">No se pudo cargar el detalle del pedido.</p>';
        });
}

// ---- REPORTE PDF ----
document.addEventListener('DOMContentLoaded', function () {
    renderTablaPedidosDashboard();

    // Inicializar gráfico de ventas
    const ctxEl = document.getElementById('salesChart');
    if (ctxEl) {
        const ctx = ctxEl.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                datasets: [{
                    label: 'Ventas 2025',
                    data: [1200, 1900, 1500, 2200, 1800, 2500, 2100, 2800, 2300, 3000, 2700, 3500],
                    borderColor: '#2d6a4f',
                    backgroundColor: 'rgba(45, 106, 79, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#e9ecef' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // Formulario de reportes
    const formReporte = document.getElementById('form-reporte-ventas');
    if (formReporte) {
        formReporte.addEventListener('submit', function (e) {
            e.preventDefault();
            const fechaInicio = document.getElementById('reporte-fecha-inicio').value;
            const fechaFin = document.getElementById('reporte-fecha-fin').value;
            if (!fechaInicio || !fechaFin) {
                alert('Por favor, seleccione una fecha de inicio y una fecha de fin.');
                return;
            }
            window.open(`/api/reportes/ventas-pdf?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, '_blank');
        });
    }
});
