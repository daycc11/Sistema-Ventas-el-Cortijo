# 🏭 Sistema de Gestión de Ventas — El Cortijo

<div align="center">

**Sistema web empresarial para la gestión de ventas, clientes, productos e inventario del molino "El Cortijo".**

Desarrollado con **Spring Boot 3.5.3** y **Java 21** | Base de datos **MySQL**

</div>

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Módulos Principales](#-módulos-principales)
- [Tecnologías y Herramientas](#️-tecnologías-y-herramientas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Credenciales de Prueba](#-credenciales-de-prueba)
- [Endpoints y Navegación](#-endpoints-y-navegación)
- [Base de Datos](#️-base-de-datos)
- [Autores](#-autores)

---

## 📖 Descripción del Proyecto

El **Sistema de Gestión de Ventas El Cortijo** es una aplicación web completa diseñada para el molino "El Cortijo", dedicado a la venta de alimentos balanceados para mascotas. El sistema permite:

- Registrar y gestionar pedidos de clientes
- Emitir comprobantes de venta (boletas)
- Controlar el inventario de productos
- Administrar empleados con roles y permisos
- Generar reportes en PDF con estadísticas de ventas
- Visualizar KPIs en tiempo real mediante un dashboard interactivo

---

## 🧩 Módulos Principales

### 1. 📊 Dashboard (Panel Principal)
- KPIs en tiempo real (total de ventas, productos, clientes, pedidos pendientes)
- Gráficas interactivas de ventas por período (Chart.js)
- Generación y descarga de reportes en formato PDF

### 2. 📋 Tablas (CRUD Completo)
- **Productos:** Crear, listar, editar y eliminar productos con tipo de alimento, precio y stock
- **Clientes:** Gestión completa de datos de clientes (DNI, teléfono, dirección)
- **Empleados:** Administración de empleados con asignación de roles
- **Pedidos:** Visualización del historial de pedidos con sus estados

### 3. 🛒 Ventas (Checkout)
Flujo de venta guiado en **4 pasos**:
1. **Carrito:** Selección de productos y cantidades
2. **Despacho:** Datos de entrega y asignación de despachador
3. **Pago:** Selección de forma de pago (Efectivo, Yape, Plin, Transferencia BCP, Tarjeta Visa)
4. **Confirmación:** Resumen del pedido y generación del comprobante

### 4. 🔐 Seguridad y Perfil
- Autenticación de usuarios con **Spring Security**
- Contraseñas encriptadas con **BCrypt**
- Roles de empleados: Administrador, Vendedor, Cajero, Despachador
- Gestión del perfil personal (actualizar datos, cambiar contraseña)

---

## 🛠️ Tecnologías y Herramientas

### Backend
| Tecnología | Versión | Descripción |
|---|---|---|
| **Java** | 21 (LTS) | Lenguaje de programación principal |
| **Spring Boot** | 3.5.3 | Framework principal del backend |
| **Spring Data JPA** | — | ORM para acceso a base de datos con Hibernate |
| **Spring Security** | — | Autenticación y autorización |
| **Spring Web MVC** | — | Controladores REST y MVC |
| **Lombok** | — | Reducción de código boilerplate (getters, setters, constructors) |
| **OpenPDF** | 1.3.30 | Generación de reportes en PDF |
| **MySQL Connector/J** | — | Driver JDBC para MySQL |
| **Maven** | — | Gestión de dependencias y construcción del proyecto |

### Frontend
| Tecnología | Descripción |
|---|---|
| **HTML5** | Estructura de las páginas |
| **CSS3** | Estilos personalizados (`main.css`) |
| **Vanilla JavaScript** | Lógica del lado del cliente |
| **Thymeleaf** | Motor de plantillas del lado del servidor (con fragmentos reutilizables) |
| **Tailwind CSS** | Framework CSS utilitario para estilos y componentes UI |
| **Chart.js** | Librería para gráficos interactivos en el dashboard |

### Herramientas de Desarrollo
| Herramienta | Uso |
|---|---|
| **IntelliJ IDEA / VS Code** | IDE de desarrollo |
| **DBeaver** | Cliente visual para administrar la base de datos |
| **MySQL Workbench**| Base de datos local (Solo de prueba)|
| **Git & GitHub** | Control de versiones |
| **Railway** | Plataforma de despliegue en la nube |

---

## 📁 Estructura del Proyecto

```
spring-java-sistema-ventas-elcortijo/
│
├── 📄 pom.xml                          # Dependencias Maven del proyecto
├── 📄 mvnw / mvnw.cmd                  # Maven Wrapper (ejecutar Maven sin instalarlo)
├── 📄 env.properties                   # Variables de entorno (NO subir a producción)
│
└── src/main/
    ├── java/pe/edu/cibertec/elcortijo/gestionventas/
    │   │
    │   ├── 📄 SistemaDeGestionDeVentasElCortijoApplication.java  # Clase principal (main)
    │   │
    │   ├── 📂 config/                   # ⚙️ Configuraciones
    │   │   └── SecurityConfig.java      # Configuración de Spring Security
    │   │
    │   ├── 📂 controller/               # 🎮 Controladores (manejan las peticiones HTTP)
    │   │   ├── ViewController.java      # Rutas de navegación entre páginas
    │   │   ├── ClienteController.java   # API REST de Clientes
    │   │   ├── ProductoController.java  # API REST de Productos
    │   │   ├── EmpleadoController.java  # API REST de Empleados
    │   │   ├── PedidoController.java    # API REST de Pedidos y Checkout
    │   │   ├── CatalogoController.java  # API REST de Catálogos (roles, tipos, estados)
    │   │   ├── ReporteController.java   # Generación de reportes PDF
    │   │   └── UsuarioController.java   # Gestión de perfil y autenticación
    │   │
    │   ├── 📂 dto/                      # 📦 Data Transfer Objects
    │   │   ├── ClienteDto.java          # DTO para transferir datos de clientes
    │   │   ├── ProductoDto.java         # DTO para transferir datos de productos
    │   │   ├── EmpleadoDto.java         # DTO para transferir datos de empleados
    │   │   ├── PedidoCompletoDto.java   # DTO del pedido completo (checkout)
    │   │   ├── PedidoResumenDto.java    # DTO resumen de pedidos (dashboard)
    │   │   ├── NuevoClienteDto.java     # DTO para crear clientes
    │   │   ├── NuevoProductoDto.java    # DTO para crear productos
    │   │   ├── NuevoEmpleadoDto.java    # DTO para crear empleados
    │   │   ├── NuevoPedidoDto.java      # DTO para crear pedidos
    │   │   ├── PerfilDto.java           # DTO del perfil del usuario
    │   │   ├── ActualizarPerfilDto.java # DTO para actualizar perfil
    │   │   ├── CambiarPasswordDto.java  # DTO para cambiar contraseña
    │   │   └── ...                      # Otros DTOs auxiliares
    │   │
    │   ├── 📂 entity/                   # 🗄️ Entidades JPA (Tablas de la BD)
    │   │   ├── ClienteEntity.java
    │   │   ├── ProductoEntity.java
    │   │   ├── EmpleadoEntity.java
    │   │   ├── PedidoEntity.java
    │   │   ├── DetallePedidoEntity.java
    │   │   ├── ComprobanteEntity.java
    │   │   ├── DespachoEntity.java
    │   │   ├── ProveedorEntity.java
    │   │   └── ...CatalogoEntity.java   # Catálogos (Roles, TipoAlimento, FormaPago, Estado)
    │   │
    │   ├── 📂 repository/              # 🔍 Repositorios JPA (Acceso a la BD)
    │   │   ├── ClienteRepository.java
    │   │   ├── ProductoRepository.java
    │   │   ├── EmpleadoRepository.java
    │   │   ├── PedidoRepository.java
    │   │   └── ...Repository.java       # Un repositorio por cada entidad
    │   │
    │   ├── 📂 service/                  # 🧠 Servicios (Lógica de negocio)
    │   │   ├── ClienteService.java      # Interfaz del servicio
    │   │   ├── ProductoService.java
    │   │   ├── PedidoService.java
    │   │   ├── GenericService.java      # Servicio genérico base
    │   │   └── impl/                    # 📂 Implementaciones
    │   │       ├── ClienteServiceImpl.java
    │   │       ├── ProductoServiceImpl.java
    │   │       ├── PedidoServiceImpl.java
    │   │       ├── UserDetailsServiceImpl.java  # Autenticación con Spring Security
    │   │       └── ...ServiceImpl.java
    │   │
    │   └── 📂 util/                     # 🔧 Utilidades
    │       └── ReporteService.java      # Lógica para generar reportes PDF con OpenPDF
    │
    └── resources/
        ├── 📄 application.properties    # Configuración de la aplicación y BD
        ├── 📄 datosDePrueba.sql         # Script SQL con datos iniciales de prueba
        │
        ├── 📂 templates/               # 🌐 Vistas HTML (Thymeleaf)
        │   ├── login.html               # Página de inicio de sesión
        │   ├── dashboard.html           # Panel principal con KPIs
        │   ├── tablas.html              # CRUD de Productos, Clientes, Empleados
        │   ├── checkout.html            # Flujo de ventas (4 pasos)
        │   ├── perfil.html              # Perfil del empleado
        │   └── fragments/               # 📂 Fragmentos reutilizables
        │       ├── head.html            # Meta tags, CSS y JS comunes
        │       ├── header.html          # Barra superior de navegación
        │       ├── sidebar.html         # Menú lateral de navegación
        │       └── modals.html          # Ventanas modales (formularios)
        │
        └── 📂 static/                  # 📁 Archivos estáticos
            ├── css/
            │   └── main.css             # Estilos personalizados del sistema
            └── js/
                ├── main.js              # JavaScript global (sidebar, navegación)
                ├── dashboard.js         # Lógica del dashboard y gráficos
                ├── tablas.js            # Lógica CRUD de las tablas
                ├── checkout.js          # Lógica del flujo de ventas
                └── perfil.js            # Lógica del perfil de usuario
```

---

## ✅ Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado lo siguiente:

| Requisito | Versión Mínima | 
|---|---|
| **Java JDK** | 21 |
| **MySQL Server** | 8.0+ |
| **Git** | Cualquiera |
| **IDE** *(recomendado)* | — | 
| **DBeaver** *(opcional)* | — | 

> **Nota:** No necesitas instalar Maven por separado. El proyecto incluye un **Maven Wrapper** (`mvnw` / `mvnw.cmd`) que descarga Maven automáticamente.

---

## 🔑 Credenciales de Prueba

El sistema viene con datos de prueba pre-cargados. Puedes iniciar sesión con cualquiera de estos empleados:

| DNI (Usuario) | Nombre | Rol | Contraseña |
|---|---|---|---|
| `74567890` | Elena Chávez Vargas | Administrador | `password` |
| `70123456` | Ana García Pérez | Vendedor | `password` |
| `71234567` | Carlos Rodríguez Quispe | Cajero | `password` |
| `73456789` | Luis Martínez Silva | Despachador | `password` |

> 📝 Todos los usuarios de prueba comparten la misma contraseña: **`password`** (encriptada con BCrypt en la base de datos).

---

## 🗺️ Endpoints y Navegación

### Páginas Web (Vistas)
| Ruta | Descripción | Acceso |
|---|---|---|
| `/login` | Página de inicio de sesión | Público |
| `/` | Dashboard (Panel principal con KPIs) | Requiere autenticación |
| `/tablas` | CRUD de Productos, Clientes, Empleados, Pedidos | Requiere autenticación |
| `/checkout` | Flujo de ventas en 4 pasos | Requiere autenticación |
| `/perfil` | Perfil del empleado autenticado | Requiere autenticación |

### APIs REST (Backend)
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/productos` | Listar todos los productos |
| `POST` | `/api/productos` | Crear un nuevo producto |
| `PUT` | `/api/productos/{id}` | Actualizar un producto |
| `DELETE` | `/api/productos/{id}` | Eliminar un producto |
| `GET` | `/api/clientes` | Listar todos los clientes |
| `POST` | `/api/clientes` | Crear un nuevo cliente |
| `PUT` | `/api/clientes/{id}` | Actualizar un cliente |
| `DELETE` | `/api/clientes/{id}` | Eliminar un cliente |
| `GET` | `/api/empleados` | Listar todos los empleados |
| `POST` | `/api/empleados` | Crear un nuevo empleado |
| `GET` | `/api/pedidos` | Listar todos los pedidos |
| `POST` | `/api/pedidos` | Crear un nuevo pedido (checkout) |
| `GET` | `/api/reportes/pdf` | Descargar reporte de ventas en PDF |
| `GET` | `/api/usuario/perfil` | Obtener perfil del usuario actual |
| `PUT` | `/api/usuario/perfil` | Actualizar perfil |
| `PUT` | `/api/usuario/password` | Cambiar contraseña |

---

## 🗄️ Base de Datos

### Diagrama de Entidades

El sistema utiliza **12 tablas** en MySQL, organizadas en 3 grupos:

**Tablas Principales:**
- `empleado` — Empleados del sistema (usuarios)
- `cliente` — Clientes del molino
- `producto` — Productos (alimentos balanceados)
- `proveedor` — Proveedores de insumos

**Tablas Transaccionales:**
- `pedido` — Pedidos de venta
- `detalle_pedido` — Detalle de cada pedido (productos y cantidades)
- `comprobante` — Comprobantes de pago emitidos
- `despacho` — Registro de despacho/entrega

**Tablas Catálogo:**
- `rol_empleado_catalogo` — Roles (Administrador, Vendedor, Cajero, Despachador)
- `tipo_alimento_catalogo` — Tipos de alimento (Cachorros, Adultos, etc.)
- `estado_pedido_catalogo` — Estados (Pendiente, En Preparación, Listo, Despachado, Cancelado)
- `forma_pago_catalogo` — Formas de pago (Efectivo, Yape, Plin, Transferencia, Tarjeta)

### Datos de Prueba

El archivo `datosDePrueba.sql` se ejecuta automáticamente al iniciar la aplicación e inserta:
- 4 roles de empleado
- 9 tipos de alimento
- 5 estados de pedido
- 5 formas de pago
- 4 empleados
- 5 clientes
- 2 proveedores
- 8 productos
- 5 pedidos con sus detalles, comprobantes y despachos

---
