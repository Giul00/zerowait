document.addEventListener('DOMContentLoaded', async () => {
  const video = document.getElementById('video');
  const saludo = document.getElementById('saludo');
  const pedidoLabel = document.getElementById('pedido');
  const confirmarBtn = document.getElementById('confirmarPedido');
  const rechazarBtn = document.getElementById('rechazarPedido');
  const mensajePedido = document.getElementById('mensajePedido');
  const pedidoNuevoDiv = document.getElementById('pedidoNuevoDiv');
  const inputNuevo = document.getElementById('pedidoNuevo');
  const enviarNuevo = document.getElementById('enviarPedidoNuevo');
  const toggleDark = document.getElementById('toggleDark');

  function applyTheme() {
    const dark = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', dark);
    toggleDark.textContent = dark ? 'Modo Claro' : 'Modo Oscuro';
  }

  toggleDark.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    document.body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('darkMode', isDark);
    toggleDark.textContent = isDark ? 'Modo Claro' : 'Modo Oscuro';
  });

  applyTheme();

  let clienteActual = null;
  let yaSaludado = false;

  await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
  await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
  await faceapi.nets.ageGenderNet.loadFromUri('/models');

  const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
  video.srcObject = stream;
  await new Promise(resolve => video.onloadedmetadata = resolve);

  const canvas = faceapi.createCanvasFromMedia(video);
  document.getElementById('contenedor-video').appendChild(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  const labeledDescriptors = await cargarBaseClientes();
  const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.5);

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptors();
    const resized = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    if (resized.length === 0) {
      yaSaludado = false;
      clienteActual = null;
      saludo.innerText = '';
      pedidoLabel.innerText = '';
      confirmarBtn.style.display = 'none';
      rechazarBtn.style.display = 'none';
      pedidoNuevoDiv.style.display = 'none';
      mensajePedido.style.display = 'none';
      return;
    }

    const results = resized.map(d => faceMatcher.findBestMatch(d.descriptor));
    results.forEach(async (result, i) => {
      const box = resized[i].detection.box;
      const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() });
      drawBox.draw(canvas);

      if (result.label !== 'unknown' && !yaSaludado) {
        yaSaludado = true;
        const cliente = await obtenerClientePorNombre(result.label);
        if (cliente) {
          clienteActual = cliente;
          saludo.innerText = `Hola ${cliente.nombre}!`;
          pedidoLabel.innerText = `¿Querés tu pedido habitual?: ${cliente.pedido}`;
          confirmarBtn.style.display = 'inline-block';
          rechazarBtn.style.display = 'inline-block';
        }
      }
    });
  }, 1000);

  confirmarBtn.addEventListener('click', () => {
    mensajePedido.innerText = "✅ Pedido enviado para su preparación.";
    mensajePedido.style.display = 'block';
    pedidoNuevoDiv.style.display = 'none';
  });

  rechazarBtn.addEventListener('click', () => {
    pedidoNuevoDiv.style.display = 'block';
    mensajePedido.style.display = 'none';
  });

  enviarNuevo.addEventListener('click', () => {
    const nuevo = inputNuevo.value;
    if (nuevo) {
      mensajePedido.innerText = `✅ Pedido personalizado "${nuevo}" enviado para su preparación.`;
      mensajePedido.style.display = 'block';
      pedidoNuevoDiv.style.display = 'none';
      inputNuevo.value = '';
    }
  });
});

// Carga base de clientes
async function cargarBaseClientes() {
  const res = await fetch('/clientes');
  const clientes = await res.json();
  const descriptors = [];

  for (const cliente of clientes) {
    const img = await faceapi.fetchImage(cliente.imagen);
    const deteccion = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    if (!deteccion) continue;
    descriptors.push(new faceapi.LabeledFaceDescriptors(cliente.nombre, [deteccion.descriptor]));
  }

  return descriptors;
}

// Buscar cliente por nombre
async function obtenerClientePorNombre(nombre) {
  try {
    const res = await fetch('/clientes');
    const clientes = await res.json();
    return clientes.find(c => c.nombre.toLowerCase() === nombre.toLowerCase());
  } catch (err) {
    console.error('[ERROR] Al obtener cliente:', err);
    return null;
  }
}

// Registro nuevo cliente (flujo antiguo restaurado)
const registrarBtn = document.getElementById('registrarCliente');
const form = document.getElementById('formRegistro');
const guardarBtn = document.getElementById('guardarCliente');
const ofertaEdad = document.getElementById('ofertaEdad');
let snapshotBlob = null;
let edadEstimada = null;

async function estimarEdad(video) {
  const detections = await faceapi.detectSingleFace(video).withAgeAndGender();
  if (detections && detections.age) {
    edadEstimada = detections.age;
    let mensaje = "";
    if (edadEstimada >= 15 && edadEstimada < 25) mensaje = "🎉 Oferta Joven: 2x1 en bebidas sin alcohol";
    else if (edadEstimada >= 25 && edadEstimada < 45) mensaje = "☕ Oferta Adulto: combo café + snack a $1000";
    else if (edadEstimada >= 45 && edadEstimada < 65) mensaje = "👵 Oferta Adulto Mayor: 20% de descuento en tu pedido";
    ofertaEdad.innerText = `Edad estimada: ${Math.round(edadEstimada)} años. ${mensaje}`;
  }
}

registrarBtn.addEventListener('click', () => {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);
  canvas.toBlob(blob => {
    snapshotBlob = blob;
    form.style.display = 'block';
    estimarEdad(video);
  }, 'image/jpeg');
});

guardarBtn.addEventListener('click', async () => {
  const nombre = document.getElementById('nombre').value;
  const edad = document.getElementById('edad').value;
  const pedido = document.getElementById('pedidoRegistro').value;
  if (!snapshotBlob || !nombre || !pedido || !edad) return alert('Faltan datos');

  const formData = new FormData();
  formData.append('nombre', nombre);
  formData.append('pedido', pedido);
  formData.append('edad', edad);
  formData.append('imagen', snapshotBlob, `${nombre.replace(/\s+/g, '_')}.jpg`);

  const res = await fetch('/api/registro', {
    method: 'POST',
    body: formData
  });

  if (res.ok) {
    alert('Cliente registrado con éxito');
    form.style.display = 'none';
    ofertaEdad.innerText = '';
    location.reload(); // recargar para volver a detectar nuevo cliente
  } else if (res.status === 409) {
    alert('Ese nombre ya está registrado');
  } else {
    alert('Error al guardar cliente');
  }
});