import { Building2, ClipboardPlus, LogOut } from 'lucide-react';

export default function Sidebar() {
  return <aside className="sidebar">
    <div className="brand">
      <img src="/logo-belen.png" alt="Clínica Belén" />
      <div><strong>CLÍNICA BELÉN</strong><small>DE FUSAGASUGÁ</small></div>
    </div>
    <div className="user-card">
      <span><Building2 /></span>
      <div><strong>ADMISIONES</strong><small>Gestión institucional</small></div>
    </div>
    <p className="nav-label">Módulo</p>
    <nav><button className="active"><ClipboardPlus /><span>Causa externa</span></button></nav>
    <button className="logout" disabled><LogOut /><span>Cerrar sesión</span></button>
  </aside>;
}
