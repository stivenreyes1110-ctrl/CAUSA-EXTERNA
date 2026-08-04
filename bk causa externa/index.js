const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { conexion } = require('./config/db');
const causaExternaRutas = require('./modulos/causaExterna/causaExterna.rutas');

const app = express();
const PORT = Number(process.env.PORT) || 3050;

app.use(cors({
    origin: [
        'http://localhost:3050',
        'http://localhost:5173',
        'http://128.0.18.50:3050',
        'http://128.0.18.50:5173'
    ]
}));
app.use(express.json());

const frontendDist = path.join(__dirname, '..', 'fd causa externa', 'dist');
if (fs.existsSync(frontendDist)) app.use(express.static(frontendDist));

app.get('/salud', (_req, res) => res.json({ ok: true, servicio: 'causa-externa' }));
app.use('/api/causas', causaExternaRutas);

const iniciar = async () => {
    try {
        await conexion();
        console.log('Conectado a SQL Server');
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Servidor escuchando en 0.0.0.0:${PORT}`);
        });
    } catch (error) {
        console.error('Error conectando a SQL Server:', error.message);
    }
};

iniciar();

module.exports = app;
