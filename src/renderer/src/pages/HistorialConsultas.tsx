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

  const state = location.state as { paciente: { nombre: string } } | null;
  const nombrePaciente = state?.paciente?.nombre || "Paciente";

  const fetchConsultas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/consultas/paciente/${id}`);
      
      if (response.status === 404) {
        setConsultas([]);
      } else if (!response.ok) {
        throw new Error('Error al obtener los datos');
      } else {
        const data = await response.json();
        setConsultas(data); 
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
    try {
      const fecha = new Date(fechaString);


      fecha.setHours(fecha.getHours() - 7); 

      return new Intl.DateTimeFormat('es-MX', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Hermosillo' 
      }).format(fecha);
    } catch (e) {
      return fechaString; 
    }
  };

  // 1. ESTADO DE CARGA (Pantalla completa)
  if (loading) {
    return (
      <div className="contenedor-pacientes centro-total">
        <Loader2 className="spinner-animado" size={50} />
        <p>Cargando historial...</p>
      </div>
    );
  }

  // 2. ESTADO DE ERROR (Solo mensaje, sin encabezados ni nada más)
  if (error) {
    return (
      <div className="contenedor-espera centro-total">
        <div className="mensaje-estado error-box">
          <AlertCircle size={48} color="#4c4c4c" />
          <h4>Error de conexión</h4>
          <p>{error}</p>
          <p className='minusp'>No se cargó el historial médico de {nombrePaciente}.</p>
          <p className="btn-reintentar" onClick={fetchConsultas}>
            Reintentar conexión
          </p>
        </div>
      </div>
    );
  }

  // 3. RENDERIZADO NORMAL
  return (
    <div className="contenedor-espera">
      <div className="header">
        <button className="btn-volver-minimal" onClick={() => navigate(-1)}>
          <ChevronLeft className='btn-volver-minimal-icon'/>
        </button>
        <h1>Historial médico</h1>
      </div>

      <div className="detalle-contenido">
        <div className="historial-intro">
          <h2>{nombrePaciente}</h2>
          <p>Registro de evolución médica</p>
        </div>

        <div className="zona-contenido">
          {consultas.length === 0 ? (
            <div className="mensaje-estado vacio-box">
              <Info className="listaesp" size={38} color="#4c4c4c" />
              <h4>No hay consultas</h4>
              <p>El historial médico de este paciente está vacío.</p>
            </div>
          ) : (
            <div className="lista-consultas">
              {consultas.map((consulta) => (
                <div 
                  key={consulta.id} 
                  className="tarjeta-consulta"
                  onClick={() => navigate(`/detalle-consulta/${consulta.id}`, { 
                    state: { consulta, nombrePaciente } 
                  })}
                >
                  <div className="tarjeta-header">
                    <div className="fecha-badge">
                      <Calendar size={16} />
                      <span>{formatearFechaHora(consulta.fecha_consulta)}</span>
                    </div>
                    <div className="diagnostico-badge">Abrir tarjeta para más información</div>
                  </div>

                  <div className="seccion-principal">
                    <h4>Motivo, síntomas y tiempo de evolución</h4>
                    <p>{consulta.motivo} &nbsp;&nbsp;/&nbsp;&nbsp; {consulta.sintomas} &nbsp;&nbsp;/&nbsp;&nbsp; {consulta.tiempo_enfermedad}</p>
                    <hr className="divisor-detalle" />
                  </div>

                  <div className="seccion-principal">
                    <h4>Observaciones</h4>
                    <p>{consulta.observaciones || '× Sin observaciones adicionales'}</p>
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