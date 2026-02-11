import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Titlebar from './components/Titlebar';
import Sidebar from './components/Sidebar';
import ListaEspera from './pages/ListaEspera';
import Expedientes from './pages/Expedientes';
import Inicio from './pages/Inicio';
import Estadisticas from './pages/Estadisticas';
import Ajustes from './pages/Ajustes';
import AñadirPaciente from './pages/AñadirPaciente';
import Consultas from './pages/Consultas';
import RegistoP from './pages/RegistroPacientes';
import DetallePaciente from './pages/DetallePaciente';
import HistorialConsultas from './pages/HistorialConsultas';
import DetalleConsulta from './pages/DetalleConsulta';

/**
 * Componente intermedio para manejar la lógica de la interfaz
 * necesaria para detectar la ruta actual.
 */
function AppContent() {
  const location = useLocation();

  // Definimos las rutas donde NO queremos que aparezca el Sidebar
  // En tu caso: la raíz "/" y la pantalla de "/inicio"
  const ocultarSidebar = location.pathname === '/' || location.pathname === '/inicio';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      
      {/* 1. BARRA DE TAREAS PERSONALIZADA (Siempre visible arriba) */}
      <Titlebar />

      {/* 2. CUERPO DE LA APP (Sidebar condicional + Contenido) */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Solo renderiza el Sidebar si no estamos en Inicio */}
        {!ocultarSidebar && <Sidebar />}

        {/* CONTENIDO VARIABLE */}
        <main style={{ 
          flex: 1, 
          padding: '20px', 
          overflowY: 'auto', 
          backgroundColor: '#fdfdfdff',
          position: 'relative' 
        }}>
          <Routes>
            <Route path='/' element={<Inicio />} />
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/expedientes" element={<Expedientes />} />
            <Route path="/lista-espera" element={<ListaEspera />} />
            <Route path="/estadisticas" element={<Estadisticas />} />
            <Route path="/paciente/:id" element={<DetallePaciente />} />
            <Route path="/historial/:id" element={<HistorialConsultas />} />
            <Route path="/ajustes" element={<Ajustes />} />
            <Route path="/añadirpaciente" element={<AñadirPaciente />} />
            <Route path="/detalle-consulta/:id" element={<DetalleConsulta />} />
            <Route path="/registro-paciente" element={<RegistoP />} />
            <Route path="/consultas" element={<Consultas />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

/**
 * Componente principal App
 */
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}