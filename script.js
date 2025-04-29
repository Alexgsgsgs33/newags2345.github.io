// CONFIGURACIÓN
const API_URL = 'https://sheetdb.io/api/v1/yuefqrt88lmh2';
const ADMIN_CREDENTIALS = [
  { user: "admin", pass: "AdminSecure123!" },  // Credenciales seguras
  { user: "editor", pass: "EditorSafe456@" }
];

// ===== SISTEMA DE AUTENTICACIÓN =====
// 1. Login
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('usuario').value.trim();
    const pass = document.getElementById('password').value.trim();
    const mensaje = document.getElementById('mensajeLogin');

    // Validación básica
    if (!user || !pass) {
      mensaje.innerHTML = '<div class="error">❌ Complete todos los campos</div>';
      return;
    }

    // Verificar credenciales
    const auth = ADMIN_CREDENTIALS.find(a => a.user === user && a.pass === pass);
    
    if (auth) {
      // Guardar sesión (mejorado)
      sessionStorage.setItem('adminAuth', JSON.stringify({
        user: auth.user,
        timestamp: new Date().getTime()
      }));
      
      // Redirigir con animación
      mensaje.innerHTML = '<div class="exito">✔️ Acceso concedido. Redirigiendo...</div>';
      setTimeout(() => window.location.href = 'registro.html', 1000);
    } else {
      // Efecto de error
      document.getElementById('loginForm').classList.add('shake');
      mensaje.innerHTML = '<div class="error">❌ Credenciales incorrectas</div>';
      setTimeout(() => {
        document.getElementById('loginForm').classList.remove('shake');
      }, 500);
    }
  });
}

// 2. Logout
if (document.getElementById('logoutBtn')) {
  document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('adminAuth');
    window.location.href = 'galeria.html';
  });
}

// 3. Verificar autenticación
function checkAuth() {
  if (window.location.pathname.includes('registro.html')) {
    const authData = JSON.parse(sessionStorage.getItem('adminAuth'));
    
    // Validar sesión (15 minutos de inactividad)
    if (!authData || (new Date().getTime() - authData.timestamp) > 900000) {
      sessionStorage.removeItem('adminAuth');
      window.location.href = 'login.html';
    }
  }
}

// ===== REGISTRO DE PRODUCTOS =====
if (document.getElementById('formulario')) {
  checkAuth(); // Verificar autenticación
  
  document.getElementById('formulario').addEventListener('submit', async (e) => {
    e.preventDefault();
    const mensaje = document.getElementById('mensaje');
    mensaje.innerHTML = '<div class="cargando">⏳ Procesando registro...</div>';

    try {
      // Validar campos
      const requiredFields = ['nombre', 'productos', 'sector', 'direccion', 'contacto', 'imagen'];
      const emptyFields = requiredFields.filter(field => !e.target[field].value.trim());
      
      if (emptyFields.length > 0) {
        throw new Error(`Complete los campos: ${emptyFields.join(', ')}`);
      }

      // Preparar datos
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
        fechaRegistro: new Date().toLocaleString('es-MX')
      };

      // Enviar a API
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data })
      });

      if (!response.ok) throw new Error('Error en el servidor');

      // Éxito
      mensaje.innerHTML = `
        <div class="exito">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          Producto registrado exitosamente!
        </div>
      `;
      
      e.target.reset();
      setTimeout(() => {
        mensaje.innerHTML = '';
      }, 3000);
      
    } catch (error) {
      mensaje.innerHTML = `
        <div class="error">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          ${error.message || 'Error al registrar'}
        </div>
      `;
    }
  });
}

// ===== GALERÍA DE PRODUCTOS =====
if (document.getElementById('galeria')) {
  cargarGaleria();

  async function cargarGaleria() {
    const galeria = document.getElementById('galeria');
    galeria.innerHTML = `
      <div class="cargando">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="2" x2="12" y2="6"></line>
          <line x1="12" y1="18" x2="12" y2="22"></line>
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
          <line x1="2" y1="12" x2="6" y2="12"></line>
          <line x1="18" y1="12" x2="22" y2="12"></line>
          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
        </svg>
        Cargando productos...
      </div>
    `;

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al cargar datos');
      
      const datos = await response.json();
      
      if (!datos || datos.length === 0) {
        galeria.innerHTML = `
          <div class="aviso">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            No hay productos registrados aún
          </div>
        `;
        return;
      }

      galeria.innerHTML = datos.map(item => `
        <div class="tarjeta" onclick="this.classList.toggle('expandida')">
          <div class="vista-compacta">
            <h3>${item.nombre || 'Sin nombre'}</h3>
            <span class="sector-tag" style="background: ${getSectorColor(item.sector)}">
              ${item.sector || 'General'}
            </span>
          </div>
          <div class="vista-expandida">
            <img src="${item.imagen || 'https://via.placeholder.com/600x400?text=Sin+imagen'}" 
                 alt="${item.nombre}" 
                 onerror="this.src='https://via.placeholder.com/600x400?text=Error+imagen'">
            <div class="info-detallada">
              <p><strong>📦 Productos:</strong> ${item.productos || '-'}</p>
              <p><strong>🏷️ Sector:</strong> ${item.sector || '-'}</p>
              <p><strong>📱 Contacto:</strong> ${item.contacto ? `<a href="tel:${item.contacto}">${item.contacto}</a>` : '-'}</p>
              <p><strong>📍 Dirección:</strong> ${item.direccion || '-'}</p>
              <div class="redes">
                ${item.facebook ? `<a href="${item.facebook}" target="_blank" class="red-social facebook">Facebook</a>` : ''}
                ${item.facebook && item.instagram ? ' • ' : ''}
                ${item.instagram ? `<a href="${item.instagram}" target="_blank" class="red-social instagram">Instagram</a>` : ''}
              </div>
            </div>
          </div>
        </div>
      `).join('');

    } catch (error) {
      galeria.innerHTML = `
        <div class="error">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          Error al cargar productos: ${error.message}
        </div>
      `;
    }
  }

  // Función auxiliar para colores de sector
  function getSectorColor(sector) {
    const colors = {
      'Alimentos': '#8E24AA',
      'Bebidas': '#AB47BC',
      'Moda': '#7B1FA2',
      'Tecnología': '#6A1B9A',
      'Servicios': '#9C27B0'
    };
    return colors[sector] || '#BA68C8';
  }
}
