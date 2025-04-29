const API_URL = 'https://sheetdb.io/api/v1/yuefqrt88lmh2';

// ===== REGISTRO =====
if (document.getElementById('formulario')) {
  const formulario = document.getElementById('formulario');
  const mensaje = document.getElementById('mensaje');

  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    mensaje.innerHTML = '<p class="cargando">Enviando datos...</p>';

    try {
      const formData = new FormData(formulario);
      const data = {
        nombre: formData.get('nombre'),
        productos: formData.get('productos'),
        sector: formData.get('sector'),
        direccion: formData.get('direccion'),
        contacto: formData.get('contacto'),
        imagen: formData.get('imagen'),
        facebook: formData.get('facebook'),
        instagram: formData.get('instagram'),
        fechaRegistro: new Date().toLocaleString()
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data })
      });

      if (!response.ok) throw new Error('Error en la API');

      mensaje.innerHTML = '<p class="exito">✅ Registro exitoso! Redirigiendo...</p>';
      setTimeout(() => window.location.href = 'galeria.html', 1500);

    } catch (error) {
      console.error('Error:', error);
      mensaje.innerHTML = `<p class="error">❌ Error: ${error.message || 'Revise los datos'}</p>`;
    }
  });
}

// ===== GALERÍA =====
if (document.getElementById('galeria')) {
  cargarGaleria();

  async function cargarGaleria() {
    const galeria = document.getElementById('galeria');
    galeria.innerHTML = '<p class="cargando">Cargando productos...</p>';

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al cargar datos');
      
      const datos = await response.json();
      
      if (datos.length === 0) {
        galeria.innerHTML = '<p class="aviso">No hay productos registrados aún</p>';
        return;
      }

      galeria.innerHTML = datos.map(item => `
        <div class="tarjeta" onclick="this.classList.toggle('expandida')">
          <div class="vista-compacta">
            <h3>${item.nombre || 'Sin nombre'}</h3>
            <p>${item.productos || 'Sin descripción'}</p>
          </div>
          <div class="vista-expandida">
            <img src="${item.imagen || 'https://via.placeholder.com/300x200?text=Sin+imagen'}" 
                 alt="${item.nombre}" 
                 onerror="this.src='https://via.placeholder.com/300x200?text=Error+imagen'">
            <div class="info-detallada">
              <p><strong>📦 Productos:</strong> ${item.productos || '-'}</p>
              <p><strong>🏷️ Sector:</strong> ${item.sector || '-'}</p>
              <p><strong>📱 Contacto:</strong> ${item.contacto || '-'}</p>
              <p><strong>📍 Dirección:</strong> ${item.direccion || '-'}</p>
              <div class="redes">
                ${item.facebook ? `<a href="${item.facebook}" target="_blank">Facebook</a>` : ''}
                ${item.facebook && item.instagram ? ' | ' : ''}
                ${item.instagram ? `<a href="${item.instagram}" target="_blank">Instagram</a>` : ''}
              </div>
            </div>
          </div>
        </div>
      `).join('');

    } catch (error) {
      console.error('Error:', error);
      galeria.innerHTML = `<p class="error">❌ Error al cargar: ${error.message}</p>`;
    }
  }
}
