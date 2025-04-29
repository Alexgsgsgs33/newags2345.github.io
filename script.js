const API_URL = 'https://sheetdb.io/api/v1/yuefqrt88lmh2';

// Lógica del formulario (solo en registro.html)
const formulario = document.getElementById('formulario');
if (formulario) {
  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(formulario));
    data.fechaRegistro = new Date().toISOString();

    try {
      const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data })
      });
      if (respuesta.ok) {
        alert('¡Producto registrado!');
        formulario.reset();
        window.location.href = 'galeria.html'; // Redirige a la galería
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al registrar. Por favor, intenta nuevamente.');
    }
  });
}

// Lógica de la galería (solo en galeria.html)
const galeria = document.getElementById('galeria');
if (galeria) {
  cargarGaleria();
}

async function cargarGaleria() {
  try {
    const respuesta = await fetch(API_URL);
    const datos = await respuesta.json();
    galeria.innerHTML = datos.map(item => `
      <div class="tarjeta">
        <img src="${item.imagen}" alt="${item.nombre}" onerror="this.src='https://via.placeholder.com/150'">
        <h3>${item.nombre}</h3>
        <p><strong>Producto:</strong> ${item.productos}</p>
        <p><strong>Sector:</strong> ${item.sector}</p>
        <p>
          <a href="${item.facebook || '#'}" target="_blank">Facebook</a> | 
          <a href="${item.instagram || '#'}" target="_blank">Instagram</a>
        </p>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error al cargar galería:', error);
    galeria.innerHTML = '<p>No se pudieron cargar los productos. Intenta más tarde.</p>';
  }
}
