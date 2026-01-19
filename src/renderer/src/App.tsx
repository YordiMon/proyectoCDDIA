import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Titlebar from './components/Titlebar'; // Asegúrate de que la ruta sea correcta
import Sidebar from './components/Sidebar';
import ListaEspera from './pages/ListaEspera';
import Expedientes from './pages/Expedientes';
import Perfil from './pages/Perfil';
import Estadisticas from './pages/Estadisticas';
import Ajustes from './pages/Ajustes';
import AñadirPaciente from './pages/AñadirPaciente';
import DetallePaciente from './pages/DetallePaciente';
import HistorialConsultas from './pages/HistorialConsultas';
import Usuarios from './pages/Usuarios';

function App() {
  return (
    <Router>
      {/* Contenedor principal en columna para separar Barra Superior de Cuerpo */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        
        {/* 1. BARRA DE TAREAS PERSONALIZADA (Siempre arriba) */}
        <Titlebar />

        {/* 2. CUERPO DE LA APP (Sidebar + Contenido) */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* MENÚ LATERAL FIJO */}
          <Sidebar />

          {/* CONTENIDO VARIABLE */}
          <main style={{ 
            flex: 1, 
            padding: '20px', 
            overflowY: 'auto', 
            backgroundColor: '#fdfdfdff',
            position: 'relative' 
          }}>
            <Routes>
              <Route path="/" element={<ListaEspera />} />
              <Route path="/expedientes" element={<Expedientes />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/estadisticas" element={<Estadisticas />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/paciente/:id" element={<DetallePaciente />} />
              <Route path="/historial/:id" element={<HistorialConsultas />} />
              <Route path="/ajustes" element={<Ajustes />} />
              <Route path="/añadirpaciente" element={<AñadirPaciente />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;