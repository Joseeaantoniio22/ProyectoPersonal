const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. CONEXIÓN A LA BASE DE DATOS
// El servidor solo se conecta. No mete datos, solo "abre la puerta".
mongoose.connect('mongodb://127.0.0.1:27017/hamburgueseria')
    .then(() => console.log('✅ Conectado a MongoDB (Tabla: productos)'))
    .catch(err => console.error('❌ Error de conexión:', err));

// 2. DEFINIR EL MODELO (El "mapa" de tu tabla)
// Esto le dice a Node qué columnas tiene tu tabla en MongoDB.
const productoSchema = new mongoose.Schema({
    nombre: String,
    categoria: String,
    descripcion: String,
    precio: Number,
    imagen: String
});

const Producto = mongoose.model('Producto', productoSchema);

// 3. RUTAS API (Los mensajeros)

// Obtener todos los productos (GET)
// Este código irá a la tabla y traerá lo que encuentre en ese momento.
app.get('/api/menu', async (req, res) => {
    try {
        const menu = await Producto.find(); // "Busca todo en la tabla productos"
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el menú" });
    }
});

// Opcional: Insertar un producto nuevo (POST) 
// Por si algún día creas un formulario para no usar Compass.
app.post('/api/productos', async (req, res) => {
    try {
        const nuevo = new Producto(req.body);
        await nuevo.save();
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(400).json({ message: "Error al guardar" });
    }
});

// 4. INICIAR EL SERVIDOR
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
    console.log(`📡 Esperando peticiones del frontend...`);
});