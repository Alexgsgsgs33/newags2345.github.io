const API_URL = 'https://sheetdb.io/api/v1/yuefqrt88lmh2';

// Cargar galería
document.addEventListener('DOMContentLoaded', () => {
  const galeria = document.getElementById('galeria');
  if (galeria) cargarGaleria();
});

async function cargarGaleria() {
  try {
    const respuesta = await fetch(API_URL);
    const datos = await respuesta.json();
    
    galeria.innerHTML = datos.map(item => `
      <div class="tarjeta" onclick="this.classList.toggle('expandida')">
        <!-- Vista compacta -->
        <div class="vista-compacta">
          <h3>${item.nombre || 'Sin nombre'}</h3>
          <p>${item.productos || 'Sin productos'}</p>
        </div>
        
        <!-- Vista expandida (oculta inicialmente) -->
        <div class="vista-expandida">
          <img src="${item.imagen || 'https://via.placeholder.com/300x200?text=Sin+imagen'}" alt="${item.nombre}">
          <div class="info-detallada">
            <h3>${item.nombre}</h3>
            <p><strong>📦 Productos:</strong> ${item.productos}</p>
            <p><strong>🏷️ Sector:</strong> ${item.sector}</p>
            <p><strong>📱 Contacto:</strong> ${item.contacto || 'N/A'}</p>
            <p><strong>📍 Dirección:</strong> ${item.direccion}</p>
            <div class="redes">
              <a href="${item.facebook || '#'}" target="_blank">Facebook</a>
              <span> | </span>
              <a href="${item.instagram || '#'}" target="_blank">Instagram</a>
            </div>
          </div>
        </div>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('Error:', error);
    galeria.innerHTML = '<p class="error">⚠️ Error al cargar los datos</p>';
  }
}
