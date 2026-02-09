import { useLocation, useNavigate } from 'react-router-dom';
import {
  User,
  ChevronLeft,
  ClipboardList,
  Stethoscope
} from 'lucide-react';
import '../styles/DetallePaciente.css';

export default function DetallePaciente() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const state = location.state as {
  paciente: {
    id: number
    nombre: string
    numero_afiliacion: string
      fecha_nacimiento: string;
      sexo: string;
      celular: string;
      contacto_emergencia: string;
      direccion: string;
      tipo_sangre: string;
      recibe_donaciones: boolean;
      alergias: string;
      enfermedades: string;
      cirugias_previas: string;
      medicamentos_actuales: string;
      }
} | null;
  const paciente = state?.paciente;

  if (!paciente) {
    return (
      <div className="centro-total">
        <p>No se encontraron datos del paciente.</p>
        <button onClick={() => navigate('/expedientes')}>Volver</button>
      </div>
    );
  }

  
  const formatearFecha = (fecha: string) => {
    if (!fecha) return 'N/A';
    const partes = fecha.split('-');
    return partes.length !== 3 ? fecha : `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  const calcularEdad = (fecha: string) => {
    if (!fecha) return 'N/A';
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
  };

  const renderDato = (valor: string) => {
    if (!valor || valor.trim() === "" || valor.toLowerCase() === "ninguna") {
      return <strong className="no-aplica">No aplica</strong>;
    }
    return <strong>{valor}</strong>;
  };

  return (
    <div className="contenedor-espera">
      <div className="header">
        <button className="btn-volver-minimal" onClick={() => navigate(-1)}>
          <ChevronLeft className='btn-volver-minimal-icon'/>
        </button>
        <h1>Expediente del paciente</h1>
      </div>

      <div className="detalle-contenido">
        <header className="perfil-info">
          <div className="avatar-circle">
            <User size={40} />
          </div>
          <div className="nombre-afiliacion">
            <h2>{paciente.nombre}</h2>
            <p>Afiliación: {paciente.numero_afiliacion}</p>
          </div>
        </header>

        <hr className="divisor-detalle" />

        <div className="bloque-datos">
          <div className="dato-columna">
            <span>Fecha de nacimiento</span>
            <strong>{formatearFecha(paciente.fecha_nacimiento)}</strong>
          </div>
          <div className="dato-columna">
            <span>Edad</span>
            <strong>{calcularEdad(paciente.fecha_nacimiento)} años</strong>
          </div>
          <div className="dato-columna">
            <span>Sexo</span>
            <strong>{paciente.sexo}</strong>
          </div>
          <div className="dato-columna">
            <span>Contacto</span>
            <strong>{paciente.celular}</strong>
          </div>
          <div className="dato-columna">
            <span>Emergencia</span>
            <strong>{paciente.contacto_emergencia}</strong>
          </div>
          <div className="dato-columna ancho-completo">
            <span>Dirección</span>
            {renderDato(paciente.direccion)}
          </div>
        </div>

        <hr className="divisor-detalle" />

        <div className="bloque-datos">
          <div className="dato-columna">
            <span>Tipo de Sangre</span>
            <strong>{paciente.tipo_sangre}</strong>
          </div>
          <div className="dato-columna">
            <span>¿Recibe donaciones?</span>
            <strong>{paciente.recibe_donaciones ? 'Sí' : 'No'}</strong>
          </div>
        </div>

        <hr className="divisor-detalle" />

        <div className="bloque-datos">
          <div className="dato-columna">
            <span>Alergias</span>
            {renderDato(paciente.alergias)}
          </div>
          <div className="dato-columna">
            <span>Enfermedades</span>
            {renderDato(paciente.enfermedades)}
          </div>
        </div>

        <hr className="divisor-detalle" />

        <div className="bloque-datos">
          <div className="dato-columna ancho-completo">
            <span>Cirugías previas</span>
            {renderDato(paciente.cirugias_previas)}
          </div>
        </div>

        <hr className="divisor-detalle" />

        <div className="bloque-datos">
          <div className="dato-columna ancho-completo">
            <span>Medicación actual</span>
            {renderDato(paciente.medicamentos_actuales)}
          </div>
        </div>
      </div>

      <div className="contenedor-botones-flotantes">
        {/* BOTÓN HISTORIAL CORREGIDO */}
        <button 
          className="btn-flotante-añadir btn-historial"
          onClick={() => navigate(`/historial/${paciente.id}`, { state: { paciente } })}
        >
          <ClipboardList size={24} />
          <span>Historial de consultas</span>
        </button>

          
        <button
  className="btn-flotante-añadir"
  onClick={(e) => {
    e.stopPropagation();
    if (!state?.paciente) return;

    navigate("/consultas", {
      state: {
        id: state.paciente.id,
        nombre: state.paciente.nombre,
        numero_afiliacion: state.paciente.numero_afiliacion,
        pacienteRegistrado: true
      }
    });
  }}
  
>
  <Stethoscope size={24} />
  <span>Nueva consulta</span>
</button>

      </div>
    </div>
  );
}