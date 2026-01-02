let todosLosProductos = [];

// Función para cargar datos del Backend
async function cargarMenu() {
    const contenedor = document.getElementById('menu-container');
    if (!contenedor) return; 

    contenedor.innerHTML = '<p class="loading">Cargando delicias...</p>';

    try {
        const respuesta = await fetch('http://localhost:3000/api/menu');
        todosLosProductos = await respuesta.json();
        
        if (todosLosProductos.length === 0) {
            contenedor.innerHTML = "<p>El menú está vacío por ahora.</p>";
            return;
        }
        
        mostrarProductos(todosLosProductos);
    } catch (error) {
        console.error("Error cargando el menú:", error);
        contenedor.innerHTML = "<p>Error al conectar con el servidor. ¿Está encendido?</p>";
    }
}

// Función para pintar los productos en el HTML
function mostrarProductos(productos) {
    const contenedor = document.getElementById('menu-container');
    contenedor.innerHTML = '';

    productos.forEach(p => {
        const card = document.createElement('div');
        card.classList.add('producto-card');

        // Seleccionamos la foto o una por defecto
        const foto = p.imagen || p.img || 'https://via.placeholder.com/300x200?text=Sin+Imagen';

        card.innerHTML = `
            <div class="card-img-container">
                <img src="${foto}" alt="${p.nombre}" class="producto-img" onerror="this.src='https://via.placeholder.com/300x200?text=Imagen+No+Disponible'">
            </div>
            <div class="card-info">
                <h3>${p.nombre}</h3>
                <p class="descripcion">${p.descripcion || 'Sin descripción disponible'}</p>
                <p class="precio">${p.precio ? p.precio.toFixed(2) : '0.00'}€</p>
                <div class="btn-card">
                    <button class="btn-add" onclick="pedir('${p.nombre}')">Añadir</button>
                    <button class="btn-info" onclick="verDetalle('${encodeURIComponent(p.nombre)}')">Mas Informacion</button>
                </div>
            </div>
        `;

        contenedor.appendChild(card);
    });
}

// NUEVA FUNCIÓN: Redirige a la página de detalles pasando el nombre en la URL
function verDetalle(nombre) {
    // Esto llevará al usuario a producto.html?nombre=Campero%20Pollo
    window.location.href = `producto.html?nombre=${nombre}`;
}

// Función para filtrar por categoría
function filtrar(categoria) {
    // Actualizar botones visualmente (Opcional pero recomendado)
    const botones = document.querySelectorAll('.btn-filtro');
    botones.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (categoria === 'todos') {
        mostrarProductos(todosLosProductos);
    } else {
        const filtrados = todosLosProductos.filter(p => p.categoria === categoria);
        mostrarProductos(filtrados);
    }
}

function pedir(nombre) {
    alert("Has añadido " + nombre + " a tu pedido");
}

// Iniciar carga cuando el documento esté listo
document.addEventListener('DOMContentLoaded', cargarMenu);