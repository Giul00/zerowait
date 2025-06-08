```markdown
# 🧠 ZeroWait – Asistente Gastronómico Inteligente

**ZeroWait** es un sistema inteligente basado en reconocimiento facial que personaliza la experiencia del cliente en locales gastronómicos, al mismo tiempo que mejora la eficiencia operativa. Fue desarrollado como una prueba de concepto (PoC) para un proyecto universitario de innovación digital.

---

## 🚀 Funcionalidades

- 📸 Reconocimiento facial en tiempo real con la cámara web.
- 🧾 Identificación de clientes habituales.
- ☕ Sugerencia automática del pedido habitual al ser reconocido.
- 🧓 Registro manual de nuevos clientes con nombre, pedido y edad.
- 🎁 Oferta personalizada según edad (joven, adulto, adulto mayor).
- 🔁 Flujo completo de confirmación de pedido o ingreso de un nuevo pedido.
- 🧠 Uso de inteligencia artificial local (face-api.js) sin conexión a la nube.
- 🔐 Toda la información se guarda localmente en archivos `.json` y carpetas persistidas por volumen de Docker.
- 🌙 Interfaz con modo oscuro opcional.

---

## 📁 Estructura del Proyecto

```

zerowait/│
├── Dockerfile
├── server.js
├── registroRoutes.js
├── package.json
│
├── clientes/                 # Contiene clientes.json con los registros
│   └── clientes.json
│
├── imagenes/                 # Contiene las imágenes de los clientes
│   └── \*.jpg
│
├── public/
│   ├── index.html            # Interfaz principal
│   ├── main.js               # Lógica de reconocimiento y UI
│   ├── style.css             # Estilos visuales
│   ├── models/               # Modelos preentrenados de face-api.js
│   └── libs/                 # Librería face-api.min.js

```

---

## 🧠 Tecnologías utilizadas

- **Node.js + Express** (backend)
- **face-api.js** (reconocimiento facial local)
- **HTML/CSS/JS** puro (frontend)
- **Docker** (para contenerizar la aplicación)
- **PostgreSQL** (opcional para escalado futuro)
- **Sin dependencias en la nube**

---

## 🐳 Cómo ejecutar el proyecto con Docker

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tuusuario/zerowait.git
   cd zerowait
```

2. Construir la imagen:

   ```bash
   docker build -t zerowait .
   ```

3. Ejecutar el contenedor:

   ```bash
   docker run -p 3000:3000 -v $(pwd)/clientes:/app/clientes -v $(pwd)/imagenes:/app/imagenes zerowait
   ```

4. Acceder desde el navegador:

   ```
   http://localhost:3000
   ```

> 📝 Asegurate de que tu navegador tenga permisos para usar la cámara.

---

## 📊 Formato del archivo `clientes.json`

```json
[
  {
    "nombre": "Carlos",
    "pedido": "Café con medialuna",
    "edad": 34,
    "imagen": "/imagenes/Carlos.jpg"
  },
  {
    "nombre": "Ana",
    "pedido": "Té verde y tostadas",
    "edad": 22,
    "imagen": "/imagenes/Ana.jpg"
  }
]
```

---

## 💡 Casos de uso

* Locales gastronómicos que desean reducir los tiempos de atención.
* Franquicias pequeñas o medianas que buscan **homogeneizar la experiencia del cliente** sin depender de la memoria del personal.
* Implementación como módulo en un sistema POS existente.

---

## 📌 Notas finales

* Este proyecto es una prueba de concepto diseñada para funcionar **sin conexión a internet** una vez que los modelos están descargados.
* Todos los datos son almacenados localmente. No hay envío a servidores externos.
* La interfaz está preparada para seguir creciendo e integrarse a una base de datos más robusta en producción.

---

Desarrollado por Giuliano Fernandez – Proyecto académico para la carrera de Tecnologías Digitales, 2025- UNICABA

```
