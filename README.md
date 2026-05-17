# 📚 Academa — Frontend
 
Proyecto Frontend para la aplicación **Academa**, diseñado para facilitar la gestión de notas y asistencias. Construido con **React** y **Vite**, consumiendo la API desarrollada en el stack MERN.
 
---
 
## 🛠️ Software necesario
 
| Herramienta | Versión mínima recomendada |
|-------------|---------------------------|
| [Node.js](https://nodejs.org/) | v18.x o superior |
| [npm](https://www.npmjs.com/) | v9.x o superior (incluido con Node) |
| [Git](https://git-scm.com/) | Cualquier versión reciente |
 
> **Tip:** podés verificar las versiones instaladas con `node -v` y `npm -v`.
 
---
 
## 📥 Instalación
 
```bash
# 1. Clonar el repositorio
git clone https://github.com/ManuelaRamdan/Academa.git
 
# 2. Acceder a la carpeta del proyecto
cd academa
 
# 3. Instalar las dependencias
npm install
 
# 4. Configurar las variables de entorno (ver sección siguiente)
```
 
---
 
## ⚙️ Variables de entorno
 
Creá un archivo `.env` en la raíz del proyecto con el siguiente contenido:
 
```env
# URL base de la API del backend
VITE_API_URL=https://parcial2-api-mern.onrender.com
```
---
 
## ▶️ Modos de ejecución
 
```bash
# Desarrollo — servidor local con hot reload
npm run dev
 
# Construcción para producción — genera los archivos optimizados en /dist
npm run build
 
# Revisar errores de código con el linter
npm run lint
 
# Preview de la build de producción en local
npm run preview
```
 
Una vez levantado en desarrollo, la app estará disponible en:
 
```
http://localhost:5173
```
 
---
 
## 🗂️ Estructura del proyecto
 
```
appAcadema-front/
│
├── public/                        # Archivos estáticos servidos directamente (logo, iconos)
│
├── src/
│   ├── assets/                    # Recursos internos del proyecto
│   │   └── react.svg
│   │
│   ├── components/                # Componentes reutilizables de la UI
│   │   ├── Admin/                 # Componentes exclusivos del panel de administración
│   │   ├── Alumno/                # Componentes relacionados a la vista del alumno
│   │   ├── AlumnoInfo.jsx         # Muestra la información detallada de un alumno
│   │   └── Loading.jsx            # Spinner de carga reutilizable (TailSpin)
│   │
│   ├── context/                   # Estado global de la aplicación
│   │   └── AuthContext.jsx        # Contexto de autenticación: token, usuario y rol
│   │
│   ├── pages/                     # Vistas principales organizadas por rol
│   │   ├── AdminPanel.jsx         # Panel de administración (gestión de entidades)
│   │   ├── PadrePanel.jsx         # Panel del padre (consulta de hijos y notas)
│   │   ├── ProfesorPanel.jsx      # Panel del profesor (notas y asistencias)
│   │   └── login.jsx              # Página de inicio de sesión
│   │
│   ├── router/                    # Configuración de rutas con React Router
│   │   ├── AppRouter.jsx          # Define todas las rutas de la aplicación
│   │   └── ProtectRoute.jsx       # Protege rutas según autenticación y rol del usuario
│   │
│   ├── services/                  # Capa de comunicación con la API del backend
│   │   ├── api.js                 # Instancia base de Axios con la URL configurada
│   │   ├── alumnoService.js       # Peticiones HTTP relacionadas con alumnos
│   │   ├── authService.js         # Peticiones de autenticación (login)
│   │   ├── cursoService.js        # Peticiones relacionadas con cursos
│   │   ├── materiaService.js      # Peticiones relacionadas con materias
│   │   ├── padreService.js        # Peticiones relacionadas con padres e hijos
│   │   ├── profeService.js        # Peticiones relacionadas con profesores
│   │   └── usuarioService.js      # Peticiones relacionadas con usuarios
│   │
│   ├── index.css                  # Estilos globales e importación de Tailwind
│   ├── App.jsx                    # Componente raíz: monta el router y los providers
│   └── main.jsx                   # Punto de entrada: renderiza App en el DOM
│
├── .env                           # Variables de entorno (no subir al repo)
├── .gitignore
├── eslint.config.js               # Reglas del linter
├── index.html                     # Plantilla HTML principal donde se monta la app
├── package.json                   # Scripts, dependencias y metadata del proyecto
├── package-lock.json
├── postcss.config.js              # Configuración de PostCSS (requerida por Tailwind)
├── tailwind.config.js             # Configuración y personalización de Tailwind CSS
└── vite.config.js                 # Configuración del bundler Vite
```
 
### Responsabilidad de cada carpeta
 
| Carpeta | Responsabilidad |
|---------|----------------|
| `public/` | Archivos estáticos que se sirven tal cual, sin pasar por el bundler (logo, favicon) |
| `components/` | Piezas de UI reutilizables e independientes del negocio. Se usan en múltiples páginas |
| `context/` | Maneja el estado global de autenticación (token JWT, datos del usuario, rol) usando Context API de React |
| `pages/` | Vistas completas asociadas a una ruta. Cada archivo agrupa la UI y lógica de un panel por rol |
| `router/` | Define qué componente se renderiza según la URL e implementa la protección de rutas por rol |
| `services/` | Centraliza todas las llamadas HTTP al backend con Axios. Cada archivo corresponde a una entidad del sistema |
 
---
 
## 📦 Librerías utilizadas
 
### Dependencias de producción
 
#### `react` v19.2.0 y `react-dom` v19.2.0
Biblioteca principal para construir la interfaz de usuario. Permite dividir la UI en **componentes reutilizables** y gestionar su estado con hooks. `react-dom` es el puente entre React y el navegador, encargado de renderizar los componentes en el DOM.
 
```jsx
// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
 
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```
 
---
 
#### `react-router-dom` v7.13.1
Gestiona la navegación y las rutas de la aplicación. Permite definir qué página se muestra según la URL. Se usa `BrowserRouter` como contenedor, `Routes` y `Route` para definir las rutas, `Navigate` para redirecciones y `useNavigate` para navegar desde el código.
 
```jsx
// router/AppRouter.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from '../pages/login';
import Admin from "../pages/AdminPanel";
import Profesor from "../pages/ProfesorPanel";
import PadrePanel from "../pages/PadrePanel";
import ProtectRoute from "./ProtectRoute";
```
 
```jsx
// router/ProtectRoute.jsx — redirige si el usuario no tiene el rol requerido
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
```
 
---
 
#### `axios` (en `services/api.js`)
Cliente HTTP para realizar peticiones a la API del backend. En `services/api.js` se configura una instancia base con la URL del backend proveniente de la variable de entorno, evitando repetir esa configuración en cada servicio.
 
```js
// services/api.js
import axios from "axios";
 
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
 
export default api;
```
 
---
 
#### `react-icons` v5.6.0
Colección de íconos vectoriales (SVG) de múltiples sets populares listos para usar como componentes de React. En el proyecto se usan íconos de **Font Awesome** para las acciones de editar y eliminar en las tablas del panel de administración.
 
```jsx
import { FaEdit, FaTrashAlt } from "react-icons/fa";
 
<FaEdit className="text-blue-500 cursor-pointer" />
<FaTrashAlt className="text-red-500 cursor-pointer" />
```
 
---
 
#### `react-loader-spinner` v8.0.2
Provee componentes de carga animados (spinners) para mostrar al usuario que una operación asíncrona está en proceso. Se usa el spinner `TailSpin`, encapsulado en el componente `Loading.jsx` para reutilizarlo en toda la app.
 
```jsx
// components/Loading.jsx
import { TailSpin } from "react-loader-spinner";
 
const Loading = () => (
  <TailSpin color="#3B82F6" height={50} width={50} />
);
 
export default Loading;
```
 
---
 
### Dependencias de desarrollo
 
#### `vite` v7.3.1 con `@vitejs/plugin-react` v5.1.1
Herramienta de construcción moderna y ultra rápida. Ofrece un servidor de desarrollo con **hot reload instantáneo** y builds de producción optimizadas. El plugin `@vitejs/plugin-react` agrega soporte para JSX y el Fast Refresh de React.
 
```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
 
export default defineConfig({
  plugins: [react()],
})
```
 
---
 
#### `tailwindcss` v3.4.19
Framework de CSS utilitario. En lugar de escribir clases CSS propias, se aplican clases predefinidas directamente en el JSX. Requiere `postcss` y `autoprefixer` para procesar los estilos correctamente con Vite.
 
```js
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```
 
```jsx
<button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
  Guardar
</button>
```
 
---
 
#### `postcss` v8.5.8 y `autoprefixer` v10.4.27
PostCSS es el procesador de CSS que Tailwind necesita para transformar sus clases utilitarias en CSS real. Autoprefixer agrega automáticamente los prefijos de navegador necesarios (`-webkit-`, `-moz-`, etc.) para garantizar compatibilidad entre navegadores. Ambos se configuran en `postcss.config.js`.
 
---
 
#### `eslint` v9.39.1 con plugins
Herramienta de análisis estático de código que detecta errores y malos patrones antes de ejecutar la app. Se configura con dos plugins específicos para React:
 
- **`eslint-plugin-react-hooks`** — verifica que los hooks de React se usen correctamente (reglas de hooks).
- **`eslint-plugin-react-refresh`** — garantiza compatibilidad con el Fast Refresh de Vite durante el desarrollo.
```bash
npm run lint   # ejecuta el linter sobre todos los archivos del proyecto
```
 
---
 
#### `@types/react` y `@types/react-dom`
Definiciones de tipos de TypeScript para React y React DOM. Aunque el proyecto está escrito en JavaScript, estas definiciones mejoran el autocompletado y la detección de errores en editores como VS Code.
 
---
 
## 🔐 Autenticación y roles
 
La app utiliza **Context API** (`AuthContext.jsx`) para mantener el estado de autenticación de forma global. Los hooks `createContext`, `useContext`, `useState` y `useEffect` de React se usan para crear y consumir el contexto.
 
Al hacer login (`authService.js`), el backend devuelve un **token JWT** que se almacena en el contexto y se envía en el header de cada petición al backend. `ProtectRoute.jsx` verifica ese token y el rol antes de renderizar cada vista.
 
| Rol | Panel | Acceso |
|-----|-------|--------|
| `admin` | `AdminPanel.jsx` | Gestión completa de alumnos, profesores, materias y usuarios |
| `profe` | `ProfesorPanel.jsx` | Visualización de sus materias y carga de notas/asistencias |
| `padre` | `PadrePanel.jsx` | Consulta del rendimiento e información de sus hijos |
 