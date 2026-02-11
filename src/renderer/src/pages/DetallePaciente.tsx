import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { User, ChevronLeft, ClipboardList, Search, Edit,  Save, AlertCircle, CheckCircle } from 'lucide-react';
import { EditarPaciente } from '../services/pacienteservice';
import type { Paciente } from '../types/Paciente';
import '../styles/DetallePaciente.css';

export default function DetallePaciente() {

  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { paciente: Paciente } | null;
  const initialPaciente = state?.paciente ?? null;
  const [pacienteState, setPacienteState] = useState<Paciente | null>(initialPaciente);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [tipoMensaje, setTipoMensaje] = useState<'error' | 'exito' | null>(null);
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formData, setFormData] = useState<Paciente>(initialPaciente as Paciente);

    // Si no se encuentra el paciente, mostrar mensaje y botón para volver
  if (!pacienteState) {
    return (
      <div className="centro-total">
        <p>No se encontraron datos del paciente.</p>
        <button onClick={() => navigate('/expedientes')}>Volver</button>
      </div>
    );
  }

   // Función para mostrar mensajes temporales
    const mostrarMensaje = (tipo: 'error' | 'exito', texto: string) => {
        setTipoMensaje(tipo);
        setMensaje(texto);
        //5 segundos para que puedan leer la lista de faltantes
        setTimeout(() => { setMensaje(null); setTipoMensaje(null); }, 5000);
    };

    // Convierte una fecha a formato YYYY-MM-DD para inputs de tipo date
    const fechaParaInput = (fecha) => {
  if (!fecha) return '';
  return new Date(fecha).toISOString().split('T')[0];
};

// Función para guardar cambios en el paciente    
const guardarCambios = async () => {
  if (!pacienteState?.id) return;

  try {
    setGuardando(true);
    await EditarPaciente(pacienteState.id, formData);
    setPacienteState(formData);
    setEditando(false);
    // Mueve el mensaje de éxito AQUÍ, fuera del catch interno
    mostrarMensaje('exito', 'El Paciente se ha actualizado correctamente');
        window.dispatchEvent(new CustomEvent('pacienteActualizado', { detail: formData }));
  } catch (error: any) {
    mostrarMensaje('error', 'Error al guardar cambios');
  } finally {
    setGuardando(false);
  }
};

// Funciones auxiliares para formatear datos
  const formatearFecha = (fecha: string) => {
    if (!fecha) return 'N/A';
    const partes = fecha.split('-');
    return partes.length !== 3 ? fecha : `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  // Calcula la edad a partir de la fecha de nacimiento
  const calcularEdad = (fecha: string) => {
    if (!fecha) return 'N/A';
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
  };

  // Renderiza un dato o "No aplica" si el valor es vacío, nulo o "ninguna"
  const renderDato = (valor: string) => {
    if (!valor || valor.trim() === "" || valor.toLowerCase() === "ninguna") {
      return <strong className="no-aplica">No aplica</strong>;
    }
    return <strong>{valor}</strong>;
  };

  return (
    <div className="contenedor-espera">
      <div className="header">
        <button className="btn-volver" onClick={() => navigate(-1)}>
          <ChevronLeft size={32} strokeWidth={2.5} />
        </button>
        <h1>Expediente del paciente</h1>
      </div>

      <div className="detalle-contenido">
        <header className="perfil-info">
          <div className="avatar-circle">
            <User size={40} />
          </div>
            <div className="nombre-afiliacion">
            <div className="dato-columna">
            {editando ? (
              <textarea
                value={formData.nombre || ''}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                rows={2}
              />
            ) : (
              renderDato(pacienteState.nombre)
            )}
          </div>

                    <p>
          Afiliación:{' '}
          {editando ? (
            <textarea
              value={formData.numero_afiliacion || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  numero_afiliacion: e.target.value
                })
              }
              rows={1}
            />
          ) : (
            pacienteState.numero_afiliacion
          )}
        </p>

          </div>
        </header>

        <hr className="divisor-detalle" />

        <div className="bloque-datos">
          <div className="dato-columna">
             <span>Fecha de nacimiento</span>

  {editando ? (
    <input
      type="date"
      value={fechaParaInput(formData.fecha_nacimiento)}
      onChange={(e) =>
        setFormData({
          ...formData,
          fecha_nacimiento: e.target.value,
        })
      }
    />
  ) : (
    <strong>{formatearFecha(pacienteState.fecha_nacimiento)}</strong>
  )}

          </div>
          <div className="dato-columna">
            <span>Edad</span>
            <strong>{calcularEdad(pacienteState.fecha_nacimiento)} años</strong>
          </div>
          <div className="dato-columna">
            <span>Sexo</span>
            
            
            {editando ? (
                <select
                  value={formData.sexo}
                  onChange={(e) =>
                    setFormData({ ...formData, sexo: e.target.value })
                  }
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
              
                </select>
              ) : (
                <strong>{pacienteState.sexo}</strong>
              )}
          </div>
          
       <div className="dato-columna">
              <span>Contacto</span>

              {editando ? (
                <input
                  type="text"
                  value={formData.celular}
                  onChange={(e) =>
                    setFormData({ ...formData, celular: e.target.value })
                  }
                />
              ) : (
                <strong>{pacienteState.celular}</strong>
              )}
            </div>

          <div className="dato-columna">
            <span>Emergencia</span>

            {editando ? (
              <input
                type="text"
                value={formData.contacto_emergencia || ''}
                onChange={(e) =>
                  setFormData({ ...formData, contacto_emergencia: e.target.value })
                }
              />
            ) : (
                renderDato(pacienteState.contacto_emergencia)
            )}
          </div>


          <div className="dato-columna ancho-completo">
            <span>Dirección</span>

            {editando ? (
              <textarea
                value={formData.direccion || ''}
                onChange={(e) =>
                  setFormData({ ...formData, direccion: e.target.value })
                }
                rows={2}
              />
            ) : (
              renderDato(pacienteState.direccion)
            )}
          </div>

          </div>
        <hr className="divisor-detalle" />
        <div className="bloque-datos">
          <div className="dato-columna">
              <span>Tipo de Sangre</span>

              {editando ? (
                <select
                  value={formData.tipo_sangre}
                  onChange={(e) =>
                    setFormData({ ...formData, tipo_sangre: e.target.value })
                  }
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              ) : (
                <strong>{pacienteState.tipo_sangre}</strong>
              )}
            </div>


          <div className="dato-columna">
            <span>¿Recibe donaciones?</span>

            {editando ? (
              <input
                type="checkbox"
                checked={formData.recibe_donaciones}
                onChange={(e) =>
                  setFormData({ ...formData, recibe_donaciones: e.target.checked })
                }
              />
            ) : (
              <strong>{pacienteState.recibe_donaciones ? 'Sí' : 'No'}</strong>
            )}
          </div>


        <hr className="divisor-detalle" />

        <div className="bloque-datos">
          <div className="dato-columna">
          <span>Alergias</span>

          {editando ? (
            <textarea 
              value={formData.alergias || ''}
              onChange={(e) =>
                setFormData({ ...formData, alergias: e.target.value })
              }
              rows={2}
            />
            ) : (
            renderDato(pacienteState.alergias)
          )}
        </div>

            <div className="dato-columna">
              <span>Enfermedades</span>

              {editando ? (
                <textarea
                  value={formData.enfermedades || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, enfermedades: e.target.value })
                  }
                  rows={2}
                />
              ) : (
                renderDato(pacienteState.enfermedades)
              )}
            </div>

        </div>

        <hr className="divisor-detalle" />

        <div className="dato-columna">
                <span>Cirugías previas</span>

          {editando ? (
            <textarea
              value={formData.cirugias_previas || ''}
              onChange={(e) =>
                setFormData({ ...formData, cirugias_previas: e.target.value })
              }
              rows={2}
            />
            ) : (
            renderDato(pacienteState.cirugias_previas)
          )}
        </div>
         <div className="dato-columna ancho-completo"> 
          </div>

        <hr className="divisor-detalle" />

        <div className="dato-columna">
          <div className="dato-columna">
              <span>Medicación actual</span>

              {editando ? (
                <textarea
                  value={formData.medicamentos_actuales || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, medicamentos_actuales: e.target.value })
                  }
                  rows={2}
                />
              ) : (
                renderDato(pacienteState.medicamentos_actuales)
              )}
            </div>

        </div>
      </div>

      <div className="contenedor-botones-flotantes">
      
               {mensaje && (
          <div className={`mensaje-flotante_EP ${tipoMensaje}`}>
              {/* Si es error muestra AlertCircle, si es exito muestra CheckCircle */}
              {tipoMensaje === 'error' ? (
              <AlertCircle size={20} style={{ marginTop: '2px' }} /> 
              ) : (  
              <CheckCircle size={20} style={{ marginTop: '2px' }} /> 
              )}                                    
              <span>{mensaje}</span>                 
          </div>       
                 )}  
                   
    {/* BOTONES SOLO CUANDO NO ESTÁ EDITANDO */}             
           
{!editando && (
  <>
    {/* BOTÓN HISTORIAL */}
    <button 
      className="btn-flotante-añadir btn-historial"
      onClick={() => 
        navigate(`/historial/${pacienteState.id}`, { 
          state: { paciente: pacienteState } 
        })
      }
    >
      <Search size={24} />
      <span>Historial de consultas</span>
    </button>

    {/* NUEVA CONSULTA */}
    <button
      className="btn-flotante-añadir"
      onClick={(e) => {
        e.stopPropagation();
        if (!pacienteState) return;

        navigate("/consultas", {
          state: {
            id: pacienteState.id,
            nombre: pacienteState.nombre,
            numero_afiliacion: pacienteState.numero_afiliacion,
            pacienteRegistrado: true
          }
        });
      }}
    >
      <ClipboardList size={24} />
      <span>Nueva consulta</span>
    </button>

    {/* EDITAR */}
    <button
      className="btn-flotante-añadir"
      onClick={() => setEditando(true)}
    >
      <Edit size={24} /> Editar expediente
    </button>
  </>
)}

  {/* BOTONES SOLO EN MODO EDICIÓN */}
  {editando && (
    <>
      <button
        className="btn-flotante-añadirG"
        onClick={guardarCambios}
        disabled={guardando}
      >
        <Save size={24} /> {guardando ? 'Guardando...' : 'Guardar cambios'}
      </button>

      <button
        className="btn-flotante-añadirC"
        onClick={() => {
          setFormData(pacienteState);
          setEditando(false);
        }}
      >
        ✕ Cancelar
      </button>
    </>
  )}
  </div>
  </div>      
  </div>        
    
  );
}