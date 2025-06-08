const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'imagenes')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_-]/g, '');
    cb(null, `${Date.now()}_${base}${ext}`);
  }
});

const upload = multer({ storage });

router.post('/api/registro', upload.single('imagen'), (req, res) => {
  const { nombre, pedido, edad } = req.body;
  const nombreTrim = nombre ? nombre.trim() : '';
  const pedidoTrim = pedido ? pedido.trim() : '';
  const clientesPath = path.join(__dirname, 'clientes', 'clientes.json');

  if (!nombreTrim || !pedidoTrim || !edad || !req.file) {
    return res.status(400).send('Faltan datos');
  }

  fs.readFile(clientesPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error leyendo base de datos');

    let clientes = [];
    try {
      clientes = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).send('Error parseando JSON');
    }

    const yaExiste = clientes.find(c => c.nombre.trim().toLowerCase() === nombreTrim.toLowerCase());
    if (yaExiste) return res.status(409).send('Cliente ya registrado');

    const nuevoCliente = {
      nombre: nombreTrim,
      pedido: pedidoTrim,
      edad: parseInt(edad),
      imagen: `/imagenes/${req.file.filename}`
    };

    clientes.push(nuevoCliente);

    fs.writeFile(clientesPath, JSON.stringify(clientes, null, 2), 'utf8', err => {
      if (err) return res.status(500).send('Error guardando cliente');
      return res.sendStatus(200);
    });
  });
});

module.exports = router;
