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

   ```text
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

- Locales gastronómicos que desean reducir los tiempos de atención.
- Franquicias pequeñas o medianas que buscan **homogeneizar la experiencia del cliente** sin depender de la memoria del personal.
- Implementación como módulo en un sistema POS existente.

---

## 📌 Notas finales

- Este proyecto es una prueba de concepto diseñada para funcionar **sin conexión a internet** una vez que los modelos están descargados.
- Todos los datos son almacenados localmente. No hay envío a servidores externos.
- La interfaz está preparada para seguir creciendo e integrarse a una base de datos más robusta en producción.

---

Desarrollado por **Giuliano Fernandez** – Proyecto académico para la carrera de **Tecnologías Digitales**, 2025 – UNICABA