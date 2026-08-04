const { Router } = require('express');
const consultaRutas = require('./consulta/consulta.ruta');
const actualizacionRutas = require('./actualizacion/actualizacion.ruta');

const rutas = Router();
rutas.use(consultaRutas);
rutas.use(actualizacionRutas);

module.exports = rutas;
