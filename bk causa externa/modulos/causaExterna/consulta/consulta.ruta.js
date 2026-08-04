const { Router } = require('express');
const controlador = require('./consulta.controlador');

const rutas = Router();
rutas.get('/', controlador.consultar);

module.exports = rutas;
