import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Calendar, 
  Activity, 
  Stethoscope, 
  Pill, 
  Clipboard,
  Clock
} from 'lucide-react';
import '../styles/DetalleConsulta.css';

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
  peso: string;
  presion: string;
  sintomas: string;
  talla: string;
  temperatura: string;
  tiempo_enfermedad: string;
}

export default function DetalleConsulta() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Recibimos la consulta y el nombre desde el state del navigate
  const state = location.state as { consulta: Consulta; nombrePaciente: string } | null;
  const consulta = state?.consulta;
  const nombrePaciente = state?.nombrePaciente || "Paciente";

  if (!consulta) {
    return (
      <div className="centro-total">
        <p>No se encontraron datos de la consulta.</p>
        <button onClick={() => navigate(-1)} className="btn-flotante-añadir">Volver</button>
      </div>
    );
  }

  const formatearFechaHora = (fechaString: string) => {
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    }).format(new Date(fechaString));
  };

  const renderDato = (valor: string) => {
    if (!valor || valor.trim() === "" || valor.toLowerCase() === "ninguna" || valor.toLowerCase() === "ninguno") {
      return <strong className="no-aplica">No aplica</strong>;
    }
    return <strong>{valor}</strong>;
  };

  return (
    <div className="contenedor-pacientes">
      <div className="header">
        <button className="btn-volver" onClick={() => navigate(-1)}>
          <ChevronLeft size={32} strokeWidth={2.5} />
        </button>
        <h1>Detalle de la consulta</h1>
      </div>

      <div className="detalle-contenido">
        <header className="perfil-info">
          <div className="avatar-circle">
             {/* Usamos el icono de Calendario para diferenciarlo del perfil de usuario */}
            <Calendar size={35} color="#1976d2" />
          </div>
          <div className="nombre-afiliacion">
            <h2>{formatearFechaHora(consulta.fecha_consulta)}</h2>
            <p>{nombrePaciente}</p>
          </div>
        </header>

        <hr className="divisor-detalle" />

        {/* BLOQUE 1: MOTIVO Y TIEMPO */}
        <div className="bloque-datos">
          <div className="dato-columna" style={{ flex: '1 1 100%' }}>
            <span><Clipboard size={14} inline-block /> Motivo y síntomas</span>
            {renderDato(`${consulta.motivo} - ${consulta.sintomas}`)}
          </div>
          <div className="dato-columna">
            <span><Clock size={14} inline-block /> Tiempo de enfermedad</span>
            {renderDato(consulta.tiempo_enfermedad)}
          </div>
        </div>

        <hr className="divisor-detalle" />

        {/* BLOQUE 2: SIGNOS VITALES */}
        <div className="bloque-datos">
          <div className="dato-columna" style={{ flex: '1 1 100%', marginBottom: '-10px' }}>
            <span style={{ color: '#1976d2', fontWeight: 'bold' }}>
              <Activity size={14} /> SIGNOS VITALES
            </span>
          </div>
          <div className="dato-columna">
            <span>Presión Arterial</span>
            <strong>{consulta.presion || 'N/A'} mmHg</strong>
          </div>
          <div className="dato-columna">
            <span>Frec. Cardíaca</span>
            <strong>{consulta.frecuencia_cardiaca || 'N/A'} lpm</strong>
          </div>
          <div className="dato-columna">
            <span>Temperatura</span>
            <strong>{consulta.temperatura || 'N/A'} °C</strong>
          </div>
          <div className="dato-columna">
            <span>Peso / Talla</span>
            <strong>{consulta.peso || 'N/A'} kg / {consulta.talla || 'N/A'} m</strong>
          </div>
        </div>

        <hr className="divisor-detalle" />

        {/* BLOQUE 3: DIAGNÓSTICO */}
        <div className="bloque-datos">
          <div className="dato-columna" style={{ flex: '1 1 100%' }}>
            <span><Stethoscope size={14} /> Diagnóstico principal</span>
            {renderDato(consulta.diagnostico)}
          </div>
        </div>

        <hr className="divisor-detalle" />

        {/* BLOQUE 4: MEDICAMENTOS */}
        <div className="bloque-datos">
          <div className="dato-columna" style={{ flex: '1 1 100%' }}>
            <span><Pill size={14} /> Medicamentos recetados</span>
            <div style={{ whiteSpace: 'pre-line', marginTop: '5px' }}>
                {renderDato(consulta.medicamentos_recetados)}
            </div>
          </div>
        </div>

        {consulta.observaciones && (
          <>
            <hr className="divisor-detalle" />
            <div className="bloque-datos">
              <div className="dato-columna" style={{ flex: '1 1 100%' }}>
                <span>Observaciones adicionales</span>
                <p style={{ margin: '5px 0', lineHeight: '1.5', color: '#333' }}>
                  {consulta.observaciones}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}