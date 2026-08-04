import { ChevronLeft, ChevronRight, FilterX, Search } from 'lucide-react';
import { useMemo } from 'react';

const columnas = [
  ['AINCAUEXT', 'Causa externa'],
  ['AINFINCON', 'Finalidad de consulta'],
  ['AINTIPDIA', 'Tipo diagnóstico'],
  ['AINGEDIRE', 'Dirección general'],
  ['DGNDIAGNO', 'Diagnóstico'],
  ['AINMOTCON', 'Motivo de consulta'],
];
const normalizar = (valor) => String(valor ?? '').toLocaleLowerCase('es-CO');

export default function TablaCausaExterna({
  datos, cargando, error, filtros, onFiltro, onLimpiar, pagina, totalPaginas, onPagina,
}) {
  const filtrados = useMemo(() => datos.filter((fila) =>
    columnas.every(([campo]) => !filtros[campo] || normalizar(fila[campo]).includes(normalizar(filtros[campo])))
  ), [datos, filtros]);
  const paginados = filtrados.slice((pagina - 1) * 10, pagina * 10);

  return <section className="support-animated-table">
    <header className="table-toolbar">
      <div><h2>Información del ingreso</h2><p>{filtrados.length} registros visibles.</p></div>
      <button className="clear-button" onClick={onLimpiar}><FilterX /> Limpiar filtros</button>
      <div className="pagination">
        <button onClick={() => onPagina(pagina - 1)} disabled={pagina <= 1} aria-label="Página anterior"><ChevronLeft /></button>
        <span>{pagina} / {totalPaginas}</span>
        <button onClick={() => onPagina(pagina + 1)} disabled={pagina >= totalPaginas} aria-label="Página siguiente"><ChevronRight /></button>
      </div>
    </header>
    <div className="table-scroll">
      <table>
        <thead>
          <tr>{columnas.map(([campo, etiqueta]) => <th key={campo}>{etiqueta}</th>)}</tr>
          <tr className="column-filters">{columnas.map(([campo, etiqueta]) => <th key={campo}>
            <div><Search /><input value={filtros[campo] || ''} onChange={(e) => onFiltro(campo, e.target.value)} placeholder="Filtrar página" aria-label={`Filtrar ${etiqueta}`} /></div>
          </th>)}</tr>
        </thead>
        <tbody>
          {cargando && <tr><td colSpan={columnas.length} className="table-state"><span className="spinner" /> Consultando ingreso…</td></tr>}
          {!cargando && error && <tr><td colSpan={columnas.length} className="table-state error">{error}</td></tr>}
          {!cargando && !error && !filtrados.length && <tr><td colSpan={columnas.length} className="table-state">Busca un ingreso para consultar su causa externa.</td></tr>}
          {!cargando && !error && paginados.map((fila, indice) => <tr key={indice}>
            {columnas.map(([campo]) => <td key={campo} className={campo === 'DGNDIAGNO' ? 'primary-cell' : ''}>{fila[campo] ?? '—'}</td>)}
          </tr>)}
        </tbody>
      </table>
    </div>
  </section>;
}
