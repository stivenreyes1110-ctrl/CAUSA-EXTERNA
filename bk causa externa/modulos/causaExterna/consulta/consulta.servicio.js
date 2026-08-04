const sql = require('mssql');
const { conexion } = require('../../../config/db');

const consultar = async ({ diagnostico, ingreso }) => {
    const pool = await conexion();
    let resultado;

    if (diagnostico) {
        resultado = await pool.request()
            .input('diagnostico', sql.VarChar, diagnostico)
            .query(`
                    SELECT * 
                    FROM GENDIAGNO 
                    WHERE DIACODIGO = @diagnostico
                `);
    } else {
        resultado = await pool.request()
            .input('ingreso', sql.VarChar, ingreso)
            .query(`
                    SELECT 
                        AINCAUEXT, 
                        AINFINCON, 
                        AINTIPDIA, 
                        AINGEDIRE, 
                        DGNDIAGNO, 
                        AINMOTCON
                    FROM ADNINGRESO 
                    WHERE LTRIM(RTRIM(AINCONSEC)) = @ingreso
                `);
    }

    return resultado.recordset;
};

module.exports = { consultar };
