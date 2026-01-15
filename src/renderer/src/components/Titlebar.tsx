import { Hospital, Minus, Square, X } from 'lucide-react';
import './Titlebar.css';

// ESTO ELIMINA EL ERROR DE TYPESCRIPT DEFINITIVAMENTE
declare global {
  interface Window {
    electronAPI: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
    };
  }
}

export default function Titlebar() {
  const handleMinimize = () => window.electronAPI.minimize();
  const handleMaximize = () => window.electronAPI.maximize();
  const handleClose = () => window.electronAPI.close();

  return (
    <nav className="custom-titlebar">
      {/* Añadimos titlebar-drag-region para que esta parte permita mover la ventana */}
      <div className="titlebar-drag-region">
        <Hospital size={26} color='white' />
        <span className="app-title">CIAS</span>
        <span className="app-subtitle">Atención primaria a jubilados del SNTE</span>
      </div>

      {/* El nombre del usuario también suele ser parte de la zona de arrastre */}
      <div className="titlebar-user">
        <span className="app-user-welcome">Bienvenido, Yordi Monreal.</span>
      </div>

      {/* Los controles DEBEN estar fuera de las zonas de drag */}
      <div className="titlebar-controls">
        <button onClick={handleMinimize} className="control-btn hover-gray">
          <Minus size={16} />
        </button>
        <button onClick={handleMaximize} className="control-btn hover-gray">
          <Square size={12} />
        </button>
        <button onClick={handleClose} className="control-btn hover-red">
          <X size={17} />
        </button>
      </div>
    </nav>
  );
}