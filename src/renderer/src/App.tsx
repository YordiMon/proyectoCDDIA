import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ListaEspera from './pages/ListaEspera';
import Consultas from './pages/Consultas';
import Pacientes from './pages/Pacientes';
import Perfil from './pages/Perfil';
import Estadisticas from './pages/Estadisticas';
import Ajustes from './pages/Ajustes';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
        {/* MENÚ LATERAL FIJO */}
        <Sidebar />

        {/* CONTENIDO VARIABLE */}
        <main style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#fdfdfdff' }}>
          <Routes>
            <Route path="/" element={<ListaEspera />} />
            <Route path="/consultas" element={<Consultas />} />
            <Route path="/pacientes" element={<Pacientes />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/estadisticas" element={<Estadisticas />} />
            <Route path="/ajustes" element={<Ajustes />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;