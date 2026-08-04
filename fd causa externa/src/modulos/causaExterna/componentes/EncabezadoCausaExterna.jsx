import { Activity, ClipboardPlus } from 'lucide-react';

export default function EncabezadoCausaExterna() {
  return <header className="support-hero">
    <div className="support-orb support-orb-one" />
    <div className="support-orb support-orb-two" />
    <div className="hero-content">
      <span className="hero-icon"><ClipboardPlus /></span>
      <div>
        <span className="eyebrow">Centro de admisiones</span>
        <h1>Causa externa por ingreso</h1>
        <p>Consulta la clasificación clínica registrada para un ingreso institucional.</p>
        <span className="service-status"><Activity /> Consulta segura parametrizada</span>
      </div>
    </div>
  </header>;
}
