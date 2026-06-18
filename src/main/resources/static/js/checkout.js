/* ============================================================
   CHECKOUT.JS - Lógica del carrito y proceso de compra
   ============================================================ */

let cartItems = [];
let selectedClientId = null;
let selectedPaymentMethod = '';
let productosDisponibles = [];
let clientesDisponibles = [];
let onClientAddedCallback = null;

// ---- NAVEGACIÓN POR PASOS ----
function goToCheckoutStep(stepNumber) {
    document.querySelectorAll('.checkout-step').forEach(step => step.classList.add('hidden'));
    const activeStep = document.getElementById(`checkout-step-${stepNumber}`);
    if (activeStep) activeStep.classList.remove('hidden');
}

// ---- CARGAR SELECTOR DE PRODUCTOS ----
function populateProductSelector() {
    const select = document.getElementById('select-producto-carrito');
    if (!select) return;
    select.innerHTML = '<option value="">Cargando productos...</option>';

    fetch('/api/productos')
        .then(response => response.json())
        .then(productos => {
            productosDisponibles = productos;
            const productosConStock = productos.filter(p => p.stock > 0);
            if (productosConStock.length === 0) {
                select.innerHTML = '<option value="">No hay productos con stock</option>';
                return;
            }
            select.innerHTML = '<option value="">-- Seleccione un producto --</option>';
            productosConStock.forEach(p => {
                select.innerHTML += `<option value="${p.idProducto}">${p.nombre} - S/${p.precioUnitario.toFixed(2)}</option>`;
            });
        })
        .catch(() => { select.innerHTML = '<option value="">Error al cargar productos</option>'; });
}

// ---- CARGAR SELECTOR DE CLIENTES ----
function populateCustomerSelector() {
    const select = document.getElementById('select-cliente');
    if (!select) return;
    select.innerHTML = '<option value="">Cargando clientes...</option>';

    fetch('/api/clientes')
        .then(response => response.json())
        .then(clientes => {
            clientesDisponibles = clientes;
            if (clientes.length === 0) {
                select.innerHTML = '<option value="">No hay clientes registrados</option>';
                return;
            }
            select.innerHTML = '<option value="">-- Seleccione un cliente --</option>';
            clientes.forEach(c => {
                select.innerHTML += `<option value="${c.idCliente}">${c.nombre} ${c.apellido} - ${c.dni}</option>`;
            });
        })
        .catch(() => { select.innerHTML = '<option value="">Error al cargar clientes</option>'; });
}

// ---- CARGAR SELECTOR DE FORMAS DE PAGO ----
function populatePaymentMethodSelector() {
    const select = document.getElementById('select-forma-pago');
    if (!select) return;

    fetch('/api/catalogos/formas-pago')
        .then(response => response.json())
        .then(formasPago => {
            select.innerHTML = '<option value="">-- Seleccione una opción --</option>';
            formasPago.forEach(fp => {
                let value = '';
                const nombre = fp.nombreFormaPago.toLowerCase();
                if (nombre.includes('tarjeta')) value = 'tarjeta';
                else if (nombre.includes('transferencia')) value = 'transferencia';
                else if (nombre.includes('yape') || nombre.includes('plin')) value = 'yape';

                if (value) {
                    select.innerHTML += `<option value="${value}" data-id="${fp.idFormaPago}">${fp.nombreFormaPago}</option>`;
                }
            });
        })
        .catch(() => { select.innerHTML = '<option value="">Error al cargar</option>'; });
}

// ---- AÑADIR PRODUCTO AL CARRITO ----
function addProductToCart() {
    const productId = parseInt(document.getElementById('select-producto-carrito').value);
    const quantity = parseInt(document.getElementById('input-cantidad-carrito').value);

    if (!productId || isNaN(quantity) || quantity < 1) {
        alert('Por favor, seleccione un producto y una cantidad válida.');
        return;
    }

    const product = productosDisponibles.find(p => p.idProducto === productId);
    if (!product) { alert('Error: Producto no encontrado.'); return; }

    const cantidadEnCarrito = cartItems.find(item => item.productId === productId)?.quantity || 0;
    if ((cantidadEnCarrito + quantity) > product.stock) {
        alert(`Stock insuficiente para "${product.nombre}". Solo quedan ${product.stock} unidades.`);
        return;
    }

    const existingItem = cartItems.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartItems.push({ productId, quantity });
    }

    renderCart();
    document.getElementById('select-producto-carrito').value = '';
    document.getElementById('input-cantidad-carrito').value = 1;
}

// ---- ACTUALIZAR CANTIDAD ----
function updateCartItemQuantity(productId, newQuantity) {
    const item = cartItems.find(i => i.productId === productId);
    if (item) {
        if (newQuantity > 0) {
            item.quantity = newQuantity;
        } else {
            cartItems = cartItems.filter(i => i.productId !== productId);
        }
        renderCart();
    }
}

// ---- ELIMINAR DEL CARRITO ----
function removeFromCart(productId) {
    cartItems = cartItems.filter(i => i.productId !== productId);
    renderCart();
}

// ---- RENDERIZAR CARRITO ----
function renderCart() {
    const tbody = document.getElementById('cart-items-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (cartItems.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center py-8 text-brand-text-secondary">El carrito está vacío.</td></tr>`;
    } else {
        cartItems.forEach(item => {
            const product = productosDisponibles.find(p => p.idProducto === item.productId);
            if (!product) return;
            const subtotal = product.precioUnitario * item.quantity;
            tbody.innerHTML += `<tr>
                <td class="table-cell">
                    <p class="font-bold text-brand-text-title">${product.nombre}</p>
                    <p class="text-sm">S/${product.precioUnitario.toFixed(2)} / unidad</p>
                </td>
                <td class="table-cell text-center">
                    <input type="number" value="${item.quantity}" min="1"
                        onchange="updateCartItemQuantity(${item.productId}, this.valueAsNumber)"
                        class="p-2 border border-gray-300 rounded-md quantity-input">
                </td>
                <td class="table-cell text-right font-semibold text-brand-text-title">S/${subtotal.toFixed(2)}</td>
                <td class="table-cell text-center">
                    <button class="text-brand-danger font-bold text-xl" onclick="removeFromCart(${item.productId})">×</button>
                </td>
            </tr>`;
        });
    }
    updateCartTotals();
}

// ---- ACTUALIZAR TOTALES ----
function updateCartTotals() {
    const subtotal = cartItems.reduce((acc, item) => {
        const product = productosDisponibles.find(p => p.idProducto === item.productId);
        if (!product) return acc;
        return acc + (product.precioUnitario * item.quantity);
    }, 0);

    const shipping = subtotal > 0 ? 5.00 : 0;
    const total = subtotal + shipping;

    document.getElementById('cart-subtotal').textContent = `S/${subtotal.toFixed(2)}`;
    document.getElementById('cart-shipping').textContent = `S/${shipping.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `S/${total.toFixed(2)}`;
}

// ---- SELECCIONAR CLIENTE ----
function handleCustomerSelect(event) {
    const customerId = parseInt(event.target.value);
    const form = document.getElementById('form-despacho');
    const customer = clientesDisponibles.find(c => c.idCliente === customerId);

    if (customer) {
        selectedClientId = customer.idCliente;
        form.querySelector('#despacho-direccion').value = customer.direccion || '';
        form.querySelector('#despacho-telefono').value = customer.telefono || '';
        form.querySelector('#despacho-dni').value = customer.dni || '';
    } else {
        selectedClientId = null;
        form.reset();
        form.querySelector('#despacho-direccion').placeholder = 'Seleccione un cliente para autocompletar';
        form.querySelector('#despacho-telefono').placeholder = 'Seleccione un cliente';
        form.querySelector('#despacho-dni').placeholder = 'Seleccione un cliente';
    }
}

// ---- SELECCIONAR FORMA DE PAGO ----
function handlePaymentMethodChange(event) {
    const selectedValue = event.target.value;
    selectedPaymentMethod = selectedValue;
    document.querySelectorAll('.payment-details').forEach(div => div.classList.add('hidden'));
    if (selectedValue) {
        const detailDiv = document.getElementById(`payment-details-${selectedValue}`);
        if (detailDiv) detailDiv.classList.remove('hidden');
    }
}

// ---- FINALIZAR COMPRA ----
function finalizePurchase() {
    if (cartItems.length === 0) { alert('El carrito está vacío.'); return; }
    if (!selectedClientId) { alert('Por favor, seleccione un cliente.'); return; }

    const selectFormaPago = document.getElementById('select-forma-pago');
    const formaPagoId = selectFormaPago.value;
    if (!formaPagoId) { alert('Por favor, seleccione una forma de pago.'); return; }

    const selectedOption = selectFormaPago.options[selectFormaPago.selectedIndex];
    const nuevoPedidoDto = {
        idCliente: selectedClientId,
        idFormaPago: parseInt(selectedOption.dataset.id),
        items: cartItems.map(item => ({ idProducto: item.productId, cantidad: item.quantity }))
    };

    const finalizeButton = document.querySelector('[onclick="finalizePurchase()"]');
    finalizeButton.disabled = true;
    finalizeButton.textContent = 'Procesando...';

    fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoPedidoDto),
    })
        .then(response => {
            if (!response.ok) return response.text().then(txt => { throw new Error(txt); });
            return response.json();
        })
        .then(pedidoCreado => {
            document.getElementById('order-id-success').textContent = `#${pedidoCreado.idPedido}`;
            goToCheckoutStep(4);
            resetCheckout();
        })
        .catch(error => {
            alert(`Error: ${error.message}`);
            finalizeButton.disabled = false;
            finalizeButton.textContent = 'Finalizar Compra';
        });
}

// ---- RESET CHECKOUT ----
function resetCheckout() {
    cartItems = [];
    selectedClientId = null;
    selectedPaymentMethod = '';
    renderCart();
    const formDespacho = document.getElementById('form-despacho');
    if (formDespacho) formDespacho.reset();
    const selectCliente = document.getElementById('select-cliente');
    if (selectCliente) selectCliente.value = '';
    const selectFormaPago = document.getElementById('select-forma-pago');
    if (selectFormaPago) selectFormaPago.value = '';
    document.querySelectorAll('.payment-details').forEach(div => div.classList.add('hidden'));
    const finalizeButton = document.querySelector('[onclick="finalizePurchase()"]');
    if (finalizeButton) {
        finalizeButton.disabled = false;
        finalizeButton.textContent = 'Finalizar Compra';
    }
}

// ---- ABRIR MODAL CLIENTE DESDE CHECKOUT ----
function openNewClientModalFromCheckout() {
    openNewClientModal();
    onClientAddedCallback = (nuevoCliente) => {
        const selectCliente = document.getElementById('select-cliente');
        selectCliente.value = nuevoCliente.idCliente;
        selectCliente.dispatchEvent(new Event('change'));
    };
}

function openNewClientModal() {
    document.getElementById('form-nuevo-cliente').reset();
    document.getElementById('cliente-id').value = '';
    document.getElementById('modal-cliente-title').textContent = 'Registrar Nuevo Cliente';
    document.getElementById('modal-cliente-submit-button').textContent = 'Guardar Cliente';
    openModal('modal-nuevo-cliente');
}

// ---- INICIALIZACIÓN ----
document.addEventListener('DOMContentLoaded', function () {
    populateProductSelector();
    populateCustomerSelector();
    populatePaymentMethodSelector();
    renderCart();

    // Form nuevo cliente (disponible en checkout)
    const formCliente = document.getElementById('form-nuevo-cliente');
    if (formCliente) {
        formCliente.addEventListener('submit', function (e) {
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
                .then(clienteGuardado => {
                    populateCustomerSelector();
                    closeModal('modal-nuevo-cliente');
                    if (typeof onClientAddedCallback === 'function' && !esEdicion) {
                        setTimeout(() => { onClientAddedCallback(clienteGuardado); onClientAddedCallback = null; }, 200);
                    }
                })
                .catch(error => alert(error.message));
        });
    }
});
