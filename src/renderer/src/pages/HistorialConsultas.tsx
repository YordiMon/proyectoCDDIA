import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  Calendar, 
  FileText
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

  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/consultas/paciente/${id}`);
        if (!response.ok) throw new Error('No se pudo obtener el historial');
        
        const data: Consulta[] = await response.json();

        setConsultas(data.sort((a, b) => new Date(b.fecha_consulta).getTime() - new Date(a.fecha_consulta).getTime()));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchConsultas();
  }, [id]);

  const formatearFechaHora = (fechaString: string) => {
    const fecha = new Date(fechaString);
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    }).format(fecha);
  };

  return (
    <div className="contenedor-pacientes">
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

        {loading && <p className="estado-carga">Cargando consultas...</p>}
        {error && <p className="estado-error">{error}</p>}

        <div className="lista-consultas">
          {consultas.map((consulta) => (
            <div key={consulta.id} className="tarjeta-consulta">
              <div className="tarjeta-header">
                <div className="fecha-badge">
                  <Calendar size={16} />
                  <span>{formatearFechaHora(consulta.fecha_consulta)}</span>
                </div>
                <div className="diagnostico-badge">Abre la tarjeta para màs informaciòn</div>
              </div>

              <div className="seccion-principal">
                <h4>Motivo y Síntomas</h4>
                <p><strong>{consulta.motivo}</strong></p>
                <p style={{fontSize: '0.9rem', color: '#64748b'}}>{consulta.sintomas}</p>
              </div>

              <div className="receta-box">
                <div className="receta-titulo">
                  <FileText size={18} />
                  <span>Plan de Tratamiento</span>
                </div>
                <p>{consulta.medicamentos_recetados}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}