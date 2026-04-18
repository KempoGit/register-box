# Terminal Register-Box (Punto de Venta)

Sistema integral de Punto de Venta (POS) y Gestión de Inventarios construido con **Angular 19+** y **Node.js (Express) + MongoDB**.

Este sistema permite cobrar productos por código de barras, restar inventario en tiempo real, admitir cobros múltiples/divididos (Ej. parte en efectivo, parte en tarjeta) y llevar un historial detallado a través de un panel de control independiente.

## 📋 Requisitos Previos (Programas a instalar)

Para ejecutar este sistema en cualquier computadora, es fundamental instalar los siguientes programas:

1. **Node.js**: Entorno de ejecución fundamental para Angular y el servidor Backend.
   - Descarga: [nodejs.org](https://nodejs.org/es/) (Descarga la versión LTS recomendada).
2. **MongoDB**: Base de datos NoSQL donde se guardarán los productos y las ventas.
   - Opción Local: [MongoDB Community Server](https://www.mongodb.com/try/download/community).
   - Opción Nube: Si prefieres no instalar una base de datos local, puedes crear un clúster gratuito en [MongoDB Atlas](https://www.mongodb.com/atlas/database) y obtener tu "String de Conexión".

---

## 🛠️ Guía de Instalación

Sigue estos sencillos pasos abriendo la terminal (o símbolo del sistema) en tu computadora:

### 1. Preparar el Servidor (Backend)

1. Abre una terminal y navega hasta la carpeta del backend:  
   `cd ruta/hacia/register-box/backend`
2. Instala las dependencias del servidor:  
   `npm install`
3. Crea un archivo `.env` en la raíz de la carpeta `backend` o edita el existente, e incluye la conexión a MongoDB:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/register-box
   ```
4. Inicia el servidor backend:  
   `npm run dev`

> El servidor quedará ejecutándose en `http://localhost:5001`.

### 2. Preparar el Cliente POS (Frontend)

1. Abre **otra** terminal (dejando abierta la del backend) y sitúate en la raíz principal del proyecto:  
   `cd ruta/hacia/register-box`
2. Instala las dependencias de Angular:  
   `npm install`
3. Inicia la interfaz de usuario:  
   `npm start` (o `ng serve`)

> Front-End desplegado exitosamente! Abre tu navegador en [http://localhost:4200](http://localhost:4200).

---

## 🚀 Uso del Sistema

La pantalla inicial mostrará un acceso seguro. Para manejar o cargar el sistema la primera vez, utiliza el **Panel de Seguridad**.

### Usuarios por Defecto

Existen dos vistas.

1. **Acceso de Cajero (Operador POS)**: En la pantalla inicial simplemente puedes indicar un correo temporal y entrarás a la terminal point of sale.
2. **Acceso de Administrador (Inventario y Mantenimiento)**:
   - **Usuario**: `admin`
   - **Contraseña**: `admin123`

### Flujo Carga de Artículos (Admin)

Antes de vender, el sistema debe tener stock:

1. En la página de ingreso, haz clic en **Seguridad DB / Acceso Admin**.
2. Ingresa con tus super-credenciales.
3. El panel mostrará la grilla de productos vacía o llena. Si usas la caja para añadir código de barras mediante "+ Agregar Producto Nuevo", aparecerán aquí.
4. Presiona **✎ Modificar** en cualquier ítem, edita la casilla de _Stock_ y haz clic en _Guardar DB_ para sumar las mercancías a los estantes virtuales.

### Flujo de Venta (Terminal POS)

1. Entra a la Terminal principal.
2. Ingresa el **código de barras** con el lector láser o manualmente.
   - (Puedes usar funciones matemáticas rápidas en el recuadro, ej: `*3 12048X` sumaría 3 artículos, o `-1 12048X` para quitar error).
3. Cuando tengas el carrito con productos, dale a interactuar al botón inferior verde **Pago**.
4. ¡El Gestor de Pagos es completamente modular!
   - Tipea el ingreso del cliente. Puedes tildar "Pago Múltiple" si el cliente te abona con $10,000 en Efvo y $2,000 en Transferencia.
5. Usa los 3 botones principales (`Efectivo`, `Tarjeta`, `Billetera Virtual`) para facturar y consolidar tu venta en la base de datos y descontar el stock al mismo tiempo.
