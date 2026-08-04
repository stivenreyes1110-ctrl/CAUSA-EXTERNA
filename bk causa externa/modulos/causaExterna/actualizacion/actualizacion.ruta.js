const { Router } = require('express');
const controlador = require('./actualizacion.controlador');

const rutas = Router();
rutas.put('/', controlador.actualizar);

module.exports = rutas;
