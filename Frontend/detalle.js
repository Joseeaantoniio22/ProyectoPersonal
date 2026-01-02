async function cargarDetalle() {
    const params = new URLSearchParams(window.location.search);
    const nombreProducto = params.get('nombre');
    const contenedor = document.getElementById('info-producto');

    if (!nombreProducto) {
        contenedor.innerHTML = "<h2>Producto no encontrado</h2>";
        return;
    }

    try {
        console.log("Intentando conectar con el servidor...");
        const respuesta = await fetch('http://localhost:3000/api/menu');
        
        if (!respuesta.ok) throw new Error("No se pudo obtener el menú");

        const productos = await respuesta.json();
        
        // Buscamos el producto (usamos trim() por si hay espacios extra)
        const nombreBuscado = decodeURIComponent(nombreProducto).trim();
        const p = productos.find(item => item.nombre.trim() === nombreBuscado);

        if (p) {
            // USAMOS VALIDACIÓN PARA EL PRECIO PARA QUE NO DE ERROR
            const precioFormateado = (p.precio && typeof p.precio === 'number') 
                ? p.precio.toFixed(2) 
                : "0.00";

            contenedor.innerHTML = `
                <img src="${p.imagen || p.img || 'https://via.placeholder.com/400'}" class="detalle-img">
                <div class="detalle-info">
                    <h1 style="font-family: 'Titulo'; color: var(--primary);">${p.nombre}</h1>
                    <p style="font-size: 1.2rem; color: #666;">${p.descripcion || 'Sin descripción disponible.'}</p>
                    <h2 style="color: #27ae60;">Precio: ${precioFormateado}€</h2>
                    <p><strong>Categoría:</strong> ${p.categoria || 'General'}</p>
                    <button class="btn-filtro active" style="width: 100%; margin-top: 20px;" onclick="alert('Añadido al carrito')">Añadir al pedido</button>
                </div>
            `;
        } else {
            contenedor.innerHTML = `<h2>Lo sentimos, el producto "${nombreBuscado}" no existe.</h2>`;
        }
    } catch (error) {
        // ESTO ES LO MÁS IMPORTANTE: Mira qué sale en la consola (F12)
        console.error("ERROR DETECTADO:", error);
        contenedor.innerHTML = `
            <div style="text-align:center">
                <h2>Error al conectar con el servidor</h2>
                <p style="color:red">${error.message}</p>
                <button onclick="location.reload()" class="btn-volver">Reintentar</button>
            </div>`;
    }
}

document.addEventListener('DOMContentLoaded', cargarDetalle);