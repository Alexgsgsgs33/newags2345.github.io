const API_URL = 'https://sheetdb.io/api/v1/yuefqrt88lmh2';

// Lógica de la galería
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
        <h2>${item.nombre || 'Sin nombre'}</h2>
        
        <div class="item-detalle">
          <span class="icono">☐</span> 
          <span class="texto">Productos/Servicios: ${item.productos || 'No especificado'}</span>
        </div>
        
        <div class="item-detalle">
          <span class="icono">✓</span> 
          <span class="texto">Sector: ${item.sector || 'No especificado'}</span>
        </div>
        
        <div class="item-detalle">
          <span class="icono">📱</span> 
          <a href="tel:${item.contacto}" class="texto">Contacto: ${item.contacto || 'N/A'}</a>
        </div>
        
        <div class="item-detalle">
          <span class="icono">📍</span> 
          <span class="texto">Dirección: ${item.direccion || 'No especificada'}</span>
        </div>
        
        <div class="redes-sociales">
          <a href="${item.facebook || '#'}" target="_blank" class="red-social">Facebook</a>
          <span class="separador">|</span>
          <a href="${item.instagram || '#'}" target="_blank" class="red-social">Instagram</a>
        </div>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('Error al cargar galería:', error);
    galeria.innerHTML = '<p class="error">⚠️ No se pudieron cargar los productos. Intenta más tarde.</p>';
  }
}
