// Configuración
const API_URL = 'https://sheetdb.io/api/v1/yuefqrt88lmh2';
const ADMIN_CREDENTIALS = [
  { user: "admin", pass: "admin123" },  // Cambia estos valores
  { user: "editor", pass: "editor123" }
];

// ===== SISTEMA DE AUTENTICACIÓN =====
// Login
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('usuario').value.trim();
    const pass = document.getElementById('password').value.trim();
    const mensaje = document.getElementById('mensajeLogin');

    const auth = ADMIN_CREDENTIALS.find(a => a.user === user && a.pass === pass);
    
    if (auth) {
      localStorage.setItem('adminAuth', 'true');
      window.location.href = 'registro.html';
    } else {
      mensaje.innerHTML = '<p class="error">Usuario o contraseña incorrectos</p>';
    }
  });
}

// Logout
if (document.getElementById('logoutBtn')) {
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('adminAuth');
    window.location.href = 'galeria.html';
  });
}

// Verificar autenticación
function checkAuth() {
  if (window.location.pathname.includes('registro.html')) {
    if (!localStorage.getItem('adminAuth')) {
      window.location.href = 'login.html';
    }
  }
}

// ===== REGISTRO DE PRODUCTOS =====
if (document.getElementById('formulario')) {
  checkAuth(); // Verificar acceso
  
  document.getElementById('formulario').addEventListener('submit', async (e) => {
    e.preventDefault();
    const mensaje = document.getElementById('mensaje');
    mensaje.innerHTML = '<p class="cargando">Guardando producto...</p>';

    try {
      const formData = new FormData(e.target);
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

      mensaje.innerHTML = '<p class="exito">✅ Producto registrado!</p>';
      e.target.reset();
      
    } catch (error) {
      mensaje.innerHTML = `<p class="error">❌ Error: ${error.message}</p>`;
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
      const datos = await response.json();

      galeria.innerHTML = datos.map(item => `
        <div class="tarjeta" onclick="this.classList.toggle('expandida')">
          <div class="vista-compacta">
            <h3>${item.nombre}</h3>
            <p>${item.productos}</p>
          </div>
          <div class="vista-expandida">
            <img src="${item.imagen || 'https://via.placeholder.com/300x200?text=Sin+imagen'}" 
                 alt="${item.nombre}" 
                 onerror="this.src='https://via.placeholder.com/300x200?text=Error+imagen'">
            <div class="info-detallada">
              <p><strong>📦 Productos:</strong> ${item.productos}</p>
              <p><strong>🏷️ Sector:</strong> ${item.sector}</p>
              <p><strong>📱 Contacto:</strong> ${item.contacto}</p>
              <p><strong>📍 Dirección:</strong> ${item.direccion}</p>
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
      galeria.innerHTML = `<p class="error">❌ Error al cargar: ${error.message}</p>`;
    }
  }
}
