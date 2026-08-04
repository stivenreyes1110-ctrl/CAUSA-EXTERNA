const servicio = require('./consulta.servicio');

const consultar = async (req, res) => {
    try {
        const diagnostico = String(req.query.diagnostico || '').trim();
        const ingreso = String(req.query.ingreso || '').trim();

        if (!diagnostico && !ingreso) {
            return res.json([]);
        }
        if (ingreso && !/^\d+$/.test(ingreso)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Debes proporcionar un número de ingreso válido.'
            });
        }

        const datos = await servicio.consultar({ diagnostico, ingreso });
        return res.json(datos);
    } catch (error) {
        console.error('Error consultando causa externa:', error.message);
        return res.status(500).json({
            ok: false,
            mensaje: 'No fue posible consultar la causa externa.'
        });
    }
};

module.exports = { consultar };
