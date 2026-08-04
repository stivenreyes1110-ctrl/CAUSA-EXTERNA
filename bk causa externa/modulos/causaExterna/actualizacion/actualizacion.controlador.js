const servicio = require('./actualizacion.servicio');

const actualizar = async (req, res) => {
    try {
        const diagnostico = String(req.body.diagnostico || '').trim();
        const ingreso = String(req.body.ingreso || '').trim();

        if (!diagnostico || !ingreso) {
            return res.status(400).json({
                mensaje: 'Por favor, complete todos los campos'
            });
        }
        if (!/^\d+$/.test(ingreso)) {
            return res.status(400).json({
                mensaje: 'El número de ingreso no es válido'
            });
        }
        if (!/^\d+$/.test(diagnostico)) {
            return res.status(400).json({
                mensaje: 'El identificador del diagnóstico no es válido'
            });
        }

        const resultado = await servicio.actualizar({ diagnostico, ingreso });
        if (!resultado.diagnosticoExiste) {
            return res.status(400).json({
                mensaje: 'El diagnóstico indicado no existe'
            });
        }
        return res.json({
            mensaje: 'Datos actualizados correctamente',
            filasAfectadas: resultado.actualizacion.rowsAffected
        });
    } catch (error) {
        console.error('Error actualizando causa externa:', error.message);
        return res.status(500).json({
            mensaje: 'Error actualizando causa externa'
        });
    }
};

module.exports = { actualizar };
