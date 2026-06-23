# 🚀 Guía de Ejecución — El Cortijo

Cómo correr el proyecto en tu PC o en la nube.

---

## 💻 EJECUCIÓN LOCAL (En tu computadora)

### Prerequisitos
- Java 21 instalado
- MySQL Server instalado (el mismo que usa MySQL Workbench)
- MySQL Workbench instalado
- El proyecto clonado o descargado en tu PC

---

### Paso 1 — Verifica que MySQL esté corriendo

MySQL Workbench se conecta al **MySQL Server** que está instalado en tu PC como un servicio de Windows. Generalmente ya corre automáticamente al iniciar tu computadora.

Para verificarlo:
1. Abre **MySQL Workbench**
2. En la pantalla principal verás tu conexión local (normalmente llamada `Local instance MySQL80` o similar)
3. Si aparece con un ícono verde o puedes hacer clic en ella para conectarte, ¡MySQL ya está corriendo! ✅

Si no puedes conectarte, abre el **Administrador de Tareas de Windows** → pestaña **Servicios** → busca `MySQL80` → clic derecho → **Iniciar**.

---

### Paso 2 — Crea la base de datos

1. Abre **MySQL Workbench** y haz clic en tu conexión local para conectarte
2. En la barra de herramientas, haz clic en el ícono de **nueva consulta** (hoja en blanco ☐) o presiona `Ctrl + T`
3. Escribe y ejecuta el siguiente comando (selecciónalo y presiona `Ctrl + Enter` o el botón ⚡):

```sql
CREATE DATABASE sistemacortijolocal;
```

> ✅ No necesitas crear las tablas. Spring Boot las crea automáticamente al arrancar.

---

### Paso 3 — Configura `application.properties`

Abre el archivo `src/main/resources/application.properties` y déjalo así:

```properties
spring.application.name=Sistema de Gestion de Ventas El Cortijo

spring.datasource.url=jdbc:mysql://localhost:3306/sistemacortijolocal
spring.datasource.username=root
spring.datasource.password=

# spring.datasource.url=jdbc:mysql://${MYSQLHOST}:${MYSQLPORT}/${MYSQLDATABASE}
# spring.datasource.username=${MYSQLUSER}
# spring.datasource.password=${MYSQLPASSWORD}

spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.show-sql=true
spring.sql.init.mode=always
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl
```

> 🔑 Las líneas con `#` al inicio están comentadas (inactivas). Las de la nube deben estar comentadas cuando trabajas en local.

---

### Paso 4 — Ejecuta el proyecto

**Desde IntelliJ IDEA:**
1. Abre el proyecto
2. Busca la clase `SistemaDeGestionDeVentasElCortijoApplication`
3. Haz clic en el botón ▶ **Run**

**Desde la terminal (CMD o PowerShell):**
```bash
mvn spring-boot:run
```

---

### Paso 5 — Abre el sistema

Abre tu navegador y ve a:
```
http://localhost:8080
```

**Usuario de prueba:**
| DNI | Contraseña | Rol |
|---|---|---|
| `74567890` | `123456` | Administrador |
| `70123456` | `123456` | Vendedor |

---

## ☁️ EJECUCIÓN EN LA NUBE (Railway)

### Prerequisitos
- Cuenta en [railway.app](https://railway.app) (usa tu cuenta de GitHub)
- El proyecto subido a un repositorio en GitHub

---

### Paso 1 — Crea un proyecto en Railway

1. Entra a [railway.app](https://railway.app) e inicia sesión con GitHub
2. Haz clic en **New Project**

---

### Paso 2 — Agrega la base de datos MySQL

1. Clic en **+ New** → **Database** → **MySQL**
2. Railway crea automáticamente la base de datos y sus credenciales
3. Ve a la pestaña **Variables** de ese servicio MySQL y anota los valores de:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLDATABASE`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`

---

### Paso 3 — Conecta tu repositorio de GitHub

1. Clic en **+ New** → **GitHub Repo**
2. Selecciona tu repositorio `Sistema-Ventas-el-Cortijo`
3. Railway detecta automáticamente que es un proyecto Maven/Spring Boot

---

### Paso 4 — Configura las variables de entorno

En la pestaña **Variables** de tu **servicio de la aplicación** (no el de MySQL), agrega:

| Variable | Valor |
|---|---|
| `MYSQLHOST` | *(el valor que copiaste del paso 2)* |
| `MYSQLPORT` | *(el valor que copiaste del paso 2)* |
| `MYSQLDATABASE` | *(el valor que copiaste del paso 2)* |
| `MYSQLUSER` | *(el valor que copiaste del paso 2)* |
| `MYSQLPASSWORD` | *(el valor que copiaste del paso 2)* |

---

### Paso 5 — Configura `application.properties` para la nube

Asegúrate de que las líneas de la **NUBE estén activas** y las locales comentadas:

```properties
spring.application.name=Sistema de Gestion de Ventas El Cortijo

# spring.datasource.url=jdbc:mysql://localhost:3306/sistemacortijolocal
# spring.datasource.username=root
# spring.datasource.password=

spring.datasource.url=jdbc:mysql://${MYSQLHOST}:${MYSQLPORT}/${MYSQLDATABASE}
spring.datasource.username=${MYSQLUSER}
spring.datasource.password=${MYSQLPASSWORD}

spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.show-sql=true
spring.sql.init.mode=always
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl
```

Luego haz `git add`, `git commit` y `git push` para subir los cambios.

---

### Paso 6 — Genera tu URL pública

1. En Railway, ve a tu servicio de la aplicación
2. Haz clic en **Settings** → **Networking** → **Generate Domain**
3. Obtendrás una URL como: `https://tu-app.up.railway.app`

¡Abre esa URL en tu navegador y el sistema estará funcionando en la nube! 🎉

---

## ⚡ TRUCO: Sin comentar/descomentar nada

Si quieres evitar modificar el archivo cada vez, usa esta configuración **inteligente** que funciona sola en ambos entornos:

```properties
spring.datasource.url=jdbc:mysql://${MYSQLHOST:localhost}:${MYSQLPORT:3306}/${MYSQLDATABASE:sistemacortijolocal}
spring.datasource.username=${MYSQLUSER:root}
spring.datasource.password=${MYSQLPASSWORD:}
```

- **En tu PC:** Como no existen las variables de entorno, usa automáticamente `localhost:3306/sistemacortijolocal`
- **En Railway:** Lee las variables que configuraste y se conecta a la nube

> ✅ Con este truco, el mismo archivo funciona en ambos entornos sin tocar nada.
