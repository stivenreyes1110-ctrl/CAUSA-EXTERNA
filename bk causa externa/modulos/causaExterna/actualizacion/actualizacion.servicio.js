const sql = require('mssql');
const { conexion } = require('../../../config/db');

const actualizar = async ({ diagnostico, ingreso }) => {
    const pool = await conexion();
    const diagnosticoConsultado = await pool.request()
        .input('diagnostico', sql.Int, Number(diagnostico))
        .query('SELECT OID FROM GENDIAGNO WHERE OID = @diagnostico');

    if (!diagnosticoConsultado.recordset.length) {
        return { diagnosticoExiste: false };
    }

    const actualizacion = await pool.request()
        .input('diagnostico', sql.Int, Number(diagnostico))
        .input('ingreso', sql.VarChar, ingreso)
        .query(`
                UPDATE ADNINGRESO 
                SET 
                    AINGEDIRE = @diagnostico,
                    AINCAUEXT = '38',
                    AINFINCON = '44',
                    AINTIPDIA = '1'
                WHERE LTRIM(RTRIM(AINCONSEC)) = @ingreso
            `);

    return { diagnosticoExiste: true, actualizacion };
};

module.exports = { actualizar };
