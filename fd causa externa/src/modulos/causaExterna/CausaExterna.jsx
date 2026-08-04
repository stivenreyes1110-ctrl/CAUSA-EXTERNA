import { useMemo, useState } from 'react';
import { RefreshCw, Search, Stethoscope } from 'lucide-react';
import Sidebar from './componentes/Sidebar';
import EncabezadoCausaExterna from './componentes/EncabezadoCausaExterna';
import TablaCausaExterna from './componentes/TablaCausaExterna';

const filtrosIniciales = {
  AINCAUEXT: '', AINFINCON: '', AINTIPDIA: '',
  AINGEDIRE: '', DGNDIAGNO: '', AINMOTCON: '',
};

export default function CausaExterna() {
  const [ingreso, setIngreso] = useState('');
  const [codigoDiagnostico, setCodigoDiagnostico] = useState('');
  const [diagnostico, setDiagnostico] = useState(null);
  const [datos, setDatos] = useState([]);
  const [filtros, setFiltros] = useState(filtrosIniciales);
  const [cargando, setCargando] = useState(false);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [pagina, setPagina] = useState(1);

  const consultarIngreso = async (event) => {
    event?.preventDefault();
    if (!/^\d+$/.test(ingreso)) {
      setError('Ingresa un número de ingreso válido para continuar.');
      setDatos([]);
      return;
    }
    setCargando(true); setError(''); setPagina(1);
    try {
      const respuesta = await fetch(`/api/causas?ingreso=${encodeURIComponent(ingreso)}`);
      const resultado = await respuesta.json();
      if (!respuesta.ok) throw new Error(resultado.mensaje || 'No fue posible consultar el ingreso.');
      setDatos(Array.isArray(resultado) ? resultado : []);
    } catch (e) {
      setDatos([]); setError(e.message);
    } finally { setCargando(false); }
  };

  const validarDiagnostico = async (event) => {
    event.preventDefault();
    const codigo = codigoDiagnostico.trim();
    if (!codigo) return setMensaje('Ingresa un código diagnóstico.');
    setCargando(true); setMensaje('');
    try {
      const respuesta = await fetch(`/api/causas?diagnostico=${encodeURIComponent(codigo)}`);
      const resultado = await respuesta.json();
      if (!respuesta.ok) throw new Error(resultado.mensaje || 'No fue posible validar el diagnóstico.');
      const encontrado = Array.isArray(resultado) ? resultado[0] : null;
      setDiagnostico(encontrado);
      setMensaje(encontrado ? 'Diagnóstico validado correctamente.' : 'No se encontró el diagnóstico indicado.');
    } catch (e) {
      setDiagnostico(null); setMensaje(e.message);
    } finally { setCargando(false); }
  };

  const actualizar = async () => {
    if (!/^\d+$/.test(ingreso) || !diagnostico?.OID) {
      return setMensaje('Consulta un ingreso y valida un diagnóstico antes de actualizar.');
    }
    setActualizando(true); setMensaje('');
    try {
      const respuesta = await fetch('/api/causas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingreso, diagnostico: String(diagnostico.OID) }),
      });
      const resultado = await respuesta.json();
      if (!respuesta.ok) throw new Error(resultado.mensaje || 'No fue posible actualizar la causa externa.');
      const afectadas = resultado.filasAfectadas?.[0] ?? 0;
      setMensaje(`${resultado.mensaje}. Filas afectadas: ${afectadas}.`);
      await consultarIngreso();
    } catch (e) {
      setMensaje(e.message);
    } finally { setActualizando(false); }
  };

  const totalPaginas = useMemo(() => Math.max(1, Math.ceil(datos.length / 10)), [datos]);

  return <div className="app-shell">
    <Sidebar />
    <main className="main-content">
      <EncabezadoCausaExterna />
      <section className="operations-surface">
        <form onSubmit={consultarIngreso}>
          <label htmlFor="ingreso">Número de ingreso</label>
          <div className="search-control">
            <Search />
            <input id="ingreso" value={ingreso} onChange={(e) => {
              setIngreso(e.target.value.replace(/\D/g, ''));
              setDiagnostico(null);
              setDatos([]);
              setError('');
            }} inputMode="numeric" placeholder="Ej. 1936406" />
            <button type="submit" disabled={cargando}>Consultar</button>
          </div>
        </form>
        <form onSubmit={validarDiagnostico}>
          <label htmlFor="diagnostico">Código diagnóstico</label>
          <div className="search-control">
            <Stethoscope />
            <input id="diagnostico" value={codigoDiagnostico} onChange={(e) => { setCodigoDiagnostico(e.target.value.toUpperCase()); setDiagnostico(null); }} placeholder="Ej. S099" />
            <button type="submit" disabled={cargando}>Validar</button>
          </div>
        </form>
        <button className="update-button" onClick={actualizar} disabled={actualizando || !diagnostico?.OID || !ingreso}>
          <RefreshCw /> {actualizando ? 'Actualizando…' : 'Actualizar causa externa'}
        </button>
      </section>
      {diagnostico && <div className="diagnosis-selection">
        <Stethoscope />
        <div><span>Diagnóstico seleccionado</span><strong>{diagnostico.DIACODIGO || codigoDiagnostico} · {diagnostico.DIANOMBRE || 'Sin descripción'}</strong><small>OID institucional: {diagnostico.OID}</small></div>
      </div>}
      {mensaje && <div className="toast-message" role="status" aria-live="polite">{mensaje}</div>}
      <TablaCausaExterna datos={datos} cargando={cargando} error={error} filtros={filtros}
        onFiltro={(campo, valor) => setFiltros((actual) => ({ ...actual, [campo]: valor }))}
        onLimpiar={() => setFiltros(filtrosIniciales)} pagina={pagina}
        totalPaginas={totalPaginas} onPagina={setPagina} />
    </main>
  </div>;
}
