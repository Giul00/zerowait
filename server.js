const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const registroRoutes = require('./registroRoutes');

// Ensure the "imagenes" directory exists for uploads
const imagenesPath = path.join(__dirname, 'imagenes');
if (!fs.existsSync(imagenesPath)) {
  fs.mkdirSync(imagenesPath, { recursive: true });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/imagenes', express.static(path.join(__dirname, 'imagenes')));
app.use(registroRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Verifica existencia del archivo de clientes
const clientesPath = path.join(__dirname, 'clientes', 'clientes.json');
if (!fs.existsSync(clientesPath)) {
  fs.mkdirSync(path.dirname(clientesPath), { recursive: true });
  fs.writeFileSync(clientesPath, '[]', 'utf8');
}

// ✅ Ruta que sirve el JSON de clientes (RESTAURADA)
app.get('/clientes', (req, res) => {
  res.sendFile(clientesPath);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT} 🚀`);
});