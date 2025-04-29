// CONFIGURACIÓN
const API_URL = 'https://sheetdb.io/api/v1/yuefqrt88lmh2';
const ADMIN_CREDENTIALS = [
  { user: "admin", pass: "AdminSecure123!" },
  { user: "editor", pass: "EditorSafe456@" }
];

// VARIABLES GLOBALES
let imagenSeleccionada = null;

// ===== MANEJO DE IMÁGENES =====
function inicializarSubidaImagen() {
  const uploadImagen = document.getElementById('uploadImagen');
  const imagenUrl = document.getElementById('imagenUrl');
  const previewImagen = document.getElementById('previewImagen');

  if (uploadImagen) {
    uploadImagen.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        // Validar tipo y tamaño de imagen (max 2MB)
        if (!file.type.match('image.*')) {
          mostrarMensaje('error', 'Por favor, selecciona un archivo de imagen válido (JPEG, PNG, etc.)');
          return;
        }
        
        if (file.size > 2 * 1024 * 1024) {
          mostrarMensaje('error', 'La imagen no debe exceder los 2MB');
          return;
        }

        const reader = new FileReader();
        
        reader.onload = function(event) {
          imagenSeleccionada = event.target.result;
          
          previewImagen.innerHTML = `
            <img src="${imagenSeleccionada}" alt="Vista previa">
            <button type="button" class="boton-eliminar" onclick="eliminarImagen()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          `;
          
          imagenUrl.disabled = true;
          imagenUrl.value = '';
          mostrarMensaje('exito', 'Imagen cargada correctamente');
        };
        
        reader.readAsDataURL(file);
      }
    });
  }

  if (imagenUrl) {
    imagenUrl.addEventListener('input', function() {
      if (this.value) {
        imagenSeleccionada = null;
        previewImagen.innerHTML = '';
        uploadImagen.value = '';
      }
    });
  }
}

function eliminarImagen() {
  imagenSeleccionada = null;
  document.getElementById('previewImagen').innerHTML = '';
  document.getElementById('uploadImagen').value = '';
  document.getElementById('imagenUrl').disabled = false;
  document.getElementById('imagenUrl').focus();
}

// ===== SISTEMA DE AUTENTICACIÓN =====
function inicializarLogin() {
  const loginForm = document.getElementById('loginForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('usuario').value.trim();
      const pass = document.getElementById('password').value.trim();
      const mensaje = document.getElementById('mensajeLogin');

      // Validación básica
      if (!user || !pass) {
        mostrarMensaje('error', 'Complete todos los campos', 'mensajeLogin');
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
        mostrarMensaje('exito', '✔️ Acceso concedido. Redirigiendo...', 'mensajeLogin');
        setTimeout(() => window.location.href = 'registro.html', 1000);
      } else {
        // Efecto de error
        loginForm.classList.add('shake');
        mostrarMensaje('error', '❌ Credenciales incorrectas', 'mensajeLogin');
        setTimeout(() => {
          loginForm.classList.remove('shake');
        }, 500);
      }
    });
  }
}

function inicializarLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('adminAuth');
      window.location.href = 'galeria.html';
    });
  }
}

function verificarAutenticacion() {
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
function inicializarFormulario() {
  const formulario = document.getElementById('formulario');
  
  if (formulario) {
    formulario.addEventListener('submit', async (e) => {
      e.preventDefault();
      mostrarMensaje('cargando', '⏳ Procesando registro...');

      try {
        // Validar campos obligatorios
        const requiredFields = ['nombre', 'productos', 'sector', 'direccion', 'contacto'];
        const emptyFields = requiredFields.filter(field => !document.getElementById(field).value.trim());
        
        if (emptyFields.length > 0) {
          throw new Error(`Complete los campos obligatorios: ${emptyFields.join(', ')}`);
        }

        // Validar imagen (obligatoria)
        const imagenUrl = document.getElementById('imagenUrl').value.trim();
        if (!imagenSeleccionada && !imagenUrl) {
          throw new Error('Debes subir una imagen o proporcionar una URL');
        }

        // Preparar datos
        const data = {
          nombre: document.getElementById('nombre').value.trim(),
          productos: document.getElementById('productos').value.trim(),
          sector: document.getElementById('sector').value,
          direccion: document.getElementById('direccion').value.trim(),
          contacto: document.getElementById('contacto').value.trim(),
          imagen: imagenSeleccionada || imagenUrl,
          facebook: document.getElementById('facebook').value.trim() || null,
          instagram: document.getElementById('instagram').value.trim() || null,
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
        mostrarMensaje('exito', '✅ Producto registrado exitosamente!');
        
        // Resetear formulario
        formulario.reset();
        imagenSeleccionada = null;
        document.getElementById('previewImagen').innerHTML = '';
        
      } catch (error) {
        mostrarMensaje('error', `❌ ${error.message || 'Error al registrar'}`);
      }
    });
  }
}

// ===== GALERÍA DE PRODUCTOS =====
async function cargarGaleria() {
  const galeria = document.getElementById('galeria');
  
  if (!galeria) return;

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
          <img src="${item.imagen.startsWith('data:image') ? item.imagen : (item.imagen || 'https://via.placeholder.com/600x400?text=Sin+imagen')}" 
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

// ===== FUNCIONES AUXILIARES =====
function mostrarMensaje(tipo, texto, contenedor = 'mensaje') {
  const iconos = {
    exito: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
    cargando: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`
  };

  const mensaje = document.getElementById(contenedor);
  if (mensaje) {
    mensaje.innerHTML = `<div class="${tipo}">${iconos[tipo] || ''} ${texto}</div>`;
  }
}

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

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
  // Sistema de autenticación
  inicializarLogin();
  inicializarLogout();
  verificarAutenticacion();
  
  // Manejo de imágenes
  inicializarSubidaImagen();
  
  // Formulario de registro
  inicializarFormulario();
  
  // Galería de productos
  if (document.getElementById('galeria')) {
    cargarGaleria();
  }
});

// Hacer funciones disponibles globalmente
window.eliminarImagen = eliminarImagen;
