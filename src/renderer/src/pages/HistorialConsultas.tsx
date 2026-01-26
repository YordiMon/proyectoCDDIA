import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  Calendar, 
  Loader2, 
  Info, 
  AlertCircle 
} from 'lucide-react';
import '../styles/HistorialConsultas.css';
import { API_BASE_URL } from '../config';

// Interface completa para asegurar que todos los datos se pasen correctamente
interface Consulta {
  id: number;
  diagnostico: string;
  fecha_consulta: string;
  frecuencia_cardiaca: string;
  frecuencia_respiratoria: string;
  medicamentos_recetados: string;
  motivo: string;
  nombre_paciente: string;
  observaciones: string;
  paciente_id: number;
  peso: string;
  presion: string;
  sintomas: string;
  talla: string;
  temperatura: string;
  tiempo_enfermedad: string;
}

export default function HistorialConsultas() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  
  // Obtenemos el nombre del paciente desde el estado de la navegación anterior
  const state = location.state as { paciente: { nombre: string } } | null;
  const nombrePaciente = state?.paciente?.nombre || "Paciente";

  const fetchConsultas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/consultas/paciente/${id}`);
      const data = await response.json();

      // Manejo de respuesta vacía según tu API
      if (data.message === "No se encontraron consultas para este paciente") {
        setConsultas([]);
      } 
      else if (!response.ok) {
        throw new Error('Servidor no disponible');
      } 
      else {
        // Ordenamos por fecha (más reciente primero)
        setConsultas(data.sort((a: Consulta, b: Consulta) => 
          new Date(b.fecha_consulta).getTime() - new Date(a.fecha_consulta).getTime()
        ));
      }
    } catch (err: any) {
      setError("No se pudo conectar con el servidor. Verifica tu conexión a internet.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchConsultas();
  }, [id, fetchConsultas]);

  const formatearFechaHora = (fechaString: string) => {
    const fecha = new Date(fechaString);
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    }).format(fecha);
  };

  if (loading) {
    return (
      <div className="contenedor-pacientes centro-total">
        <Loader2 className="spinner-animado" size={50} />
        <p>Conectando con el servidor...</p>
      </div>
    );
  }

  return (
    <div className="contenedor-espera">
      <div className="header">
        <button className="btn-volver" onClick={() => navigate(-1)}>
          <ChevronLeft size={32} strokeWidth={2.5} />
        </button>
        <h1>Historial Médico</h1>
      </div>

      <div className="detalle-contenido">
        <div className="historial-intro">
          <h2>{nombrePaciente}</h2>
          <p>Registro de evolución clínica</p>
        </div>

        <div className="zona-contenido">
          {error ? (
            <div className="mensaje-estado error-box">
              <AlertCircle size={38} color="#4c4c4c" />
              <h4>Error de conexión</h4>
              <p>{error}</p>
              <p className="btn-reintentar" onClick={fetchConsultas}>
                Reintentar conexión
              </p>
            </div>
          ) : consultas.length === 0 ? (
            <div className="mensaje-estado vacio-box">
              <Info size={38} color="#4c4c4c" />
              <h4>No hay consultas</h4>
              <p>El historial médico de este paciente se encuentra vacío actualmente.</p>
            </div>
          ) : (
            <div className="lista-consultas">
              {consultas.map((consulta) => (
                <div 
                  key={consulta.id} 
                  className="tarjeta-consulta"
                  // NAVEGACIÓN: Enviamos el objeto consulta y el nombre del paciente
                  onClick={() => navigate(`/detalle-consulta/${consulta.id}`, { 
                    state: { consulta, nombrePaciente } 
                  })}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="tarjeta-header">
                    <div className="fecha-badge">
                      <Calendar size={16} />
                      <span>{formatearFechaHora(consulta.fecha_consulta)}</span>
                    </div>
                    <div className="diagnostico-badge">Abrir tarjeta para más información</div>
                  </div>

                  <div className="seccion-principal">
                    <h4>Motivo y síntomas</h4>
                    <p>{consulta.motivo}</p>
                    <p>{consulta.sintomas}</p>
                    <hr className="divisor-detalle" />
                  </div>

                  <div className="seccion-principal">
                    <h4>Diagnóstico principal</h4>
                    <p>{consulta.diagnostico}</p>
                    <hr className="divisor-detalle" />
                  </div>

                  <div className="seccion-principal">
                    <h4>Medicamentos recetados</h4>
                    <p>{consulta.medicamentos_recetados}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}