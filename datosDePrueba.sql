CREATE DATABASE sistemacortijolocal;
USE sistemacortijolocal;

-- ============================================================
-- DATOS DE PRUEBA PARA BASE DE DATOS LOCAL - COMPATIBLE CON MYSQL
-- ============================================================

-- Catálogos
INSERT IGNORE INTO rol_empleado_catalogo (nombre_rol) VALUES
    ('Administrador'), ('Vendedor'), ('Cajero'), ('Despachador');

INSERT IGNORE INTO tipo_alimento_catalogo (nombre_tipo_alimento) VALUES
    ('Cachorros Iniciador'),
    ('Gestacion Raza Pekeña'),
    ('cachorros Crecimiento'),
    ('Gestacion Raza Grande'),
    ('Adultos Raza Pekeña'),
    ('Lactancia raza pekeña'),
    ('Adultos Raza Grande'),
    ('Lactancia raza grande'),
    ('crecimiento raza grande');

INSERT IGNORE INTO estado_pedido_catalogo (nombre_estado) VALUES
    ('Pendiente'), ('En Preparación'), ('Listo para Despacho'), ('Despachado'), ('Cancelado');

INSERT IGNORE INTO forma_pago_catalogo (nombre_forma_pago) VALUES
    ('Efectivo'), ('Yape'), ('Plin'), ('Transferencia BCP'), ('Tarjeta Visa');

-- Empleados
INSERT IGNORE INTO empleado
(dni, nombre, apellido, password, fecha_nac, telefono, direccion, id_rol_empleado, activo)
VALUES
('74567890', 'Elena',  'Chávez Vargas',    '$2a$10$Hzr9PXLwOIv4R3LbZpS96uHQTWPts8H3JH7/RROdPS9yGxViUM4aC', '1980-07-25', '945678901', 'Av. América Sur 321, Trujillo', 1, 1),
('70123456', 'Ana',    'García Pérez',     '$2a$10$Hzr9PXLwOIv4R3LbZpS96uHQTWPts8H3JH7/RROdPS9yGxViUM4aC', '1990-05-15', '987654321', 'Av. España 123, Trujillo',      2, 1),
('71234567', 'Carlos', 'Rodríguez Quispe', '$2a$10$Hzr9PXLwOIv4R3LbZpS96uHQTWPts8H3JH7/RROdPS9yGxViUM4aC', '1985-08-20', '912345678', 'Jr. Pizarro 456, Trujillo',     3, 1),
('73456789', 'Luis',   'Martínez Silva',   '$2a$10$Hzr9PXLwOIv4R3LbZpS96uHQTWPts8H3JH7/RROdPS9yGxViUM4aC', '1988-11-30', '934567890', 'Calle Los Laureles 789, Víctor Larco', 4, 1);

-- Clientes
INSERT IGNORE INTO cliente (nombre, apellido, dni, telefono, direccion, activo) VALUES
('Juan',  'Paredes Solano', '40123456', '998877665', 'Psj. Las Begonias 102, La Esperanza', 1),
('Maria', 'Flores Castillo','41234567', '988776655', 'Av. Mansiche 2030, Trujillo',         1),
('Pedro', 'Gonzales Diaz',  '42345678', '977665544', 'Calle San Martin 505, Moche',         1),
('Lucia', 'Ramirez Torres', '43456789', '966554433', 'Urb. Primavera, Calle Las Rosas 11, Trujillo', 1),
('Jorge', 'Mendoza Lee',    '44567890', '955443322', 'Av. El Golf 555, Trujillo',          1);

-- Proveedores
INSERT IGNORE INTO proveedor (nombre, ruc, direccion, telefono) VALUES
('Agroinsumos del Norte S.A.C.', '20123456789', 'Parque Industrial, Trujillo', '044-200100'),
('Nutrimentos Perú S.R.L.',      '20987654321', 'Av. Industrial 458, Lima',    '01-5002030');

-- Productos
INSERT IGNORE INTO producto (nombre, id_tipo_alimento, precio_unitario, stock, activo) VALUES
('Ricocan Plus', 1, 65.50, 200, 1),
('Zeus Premium', 2, 62.00, 350, 1),
('Roya Canin',   4, 70.00, 150, 1),
('cambo',        5, 68.50, 300, 1),
('Mimaskot',     7, 75.20, 180, 1),
('Dog Chow',     3, 60.80, 120, 1),
('Gran Plus',    9, 25.00, 500, 1),
('Gran Perro',   1, 85.00,  80, 1);

-- Pedidos
INSERT INTO pedido (fecha, hora, id_estado_pedido, id_cliente, id_empleado_vendedor) VALUES
('2025-12-20', '09:30:00', 4, 1, 2),
('2025-12-21', '11:15:00', 3, 2, 2),
('2025-12-22', '10:00:00', 2, 3, 3),
('2025-12-23', '14:45:00', 1, 5, 2),
('2025-12-23', '16:00:00', 1, 4, 3);

-- Detalle pedidos
INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario_venta, subtotal) VALUES
(1, 1, 10, 65.50,  655.00),
(1, 2,  5, 62.00,  310.00),
(2, 4, 20, 68.50, 1370.00),
(3, 5, 15, 75.20, 1128.00),
(4, 7, 30, 25.00,  750.00),
(5, 8,  2, 85.00,  170.00),
(5, 3, 10, 60.80,  608.00);

-- Comprobantes
INSERT INTO comprobante (fecha, total, id_forma_pago, id_pedido) VALUES
('2025-12-20',  965.00, 1, 1),
('2025-12-21', 1370.00, 2, 2),
('2025-12-22', 1128.00, 4, 3);

-- Despacho
INSERT INTO despacho (fecha_despacho, id_empleado_despachador, id_pedido, observaciones) VALUES
('2025-12-20 15:00:00', 4, 1, 'Cliente recogió en tienda. Todo conforme.');