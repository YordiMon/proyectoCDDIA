import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePacientes } from '../hooks/pacientesEspera'
import { 
  CheckCircle, 
  Info, 
  Trash2, 
  UserPlus, 
  Loader2, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/ListaEspera.css';
// Asegúrate de importar los estilos si la clase 'mensaje-error-flotante_PR' está ahí
import '../styles/pacientesReg.css'; 
import { existePaciente } from '../services/pacienteservice';

export default function ListaEspera() {
  const {
    pacientes,
    loading,
    isRefreshing,
    error,
    atenderPaciente,
    quitarPaciente,
    recargarLista
  } = usePacientes()

  // mostrar ventana modal
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pacienteAEliminar, setPacienteAEliminar] = useState<number | null>(null);

  const navigate = useNavigate()
  const botonAnadirRef = useRef<HTMLAnchorElement>(null)
  
  // Estados para el sistema de mensajes dinámicos
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [tipoMensaje, setTipoMensaje] = useState<'error' | 'exito' | null>(null);

  useEffect(() => {
    if (!loading && !error && botonAnadirRef.current) {
      botonAnadirRef.current.focus();
    }
  }, [loading, error]);

  // CALCULO: Filtramos solo los pacientes que realmente están "En espera" (estado '1')
  // para el contador de la cabecera.
  const totalEnEspera = pacientes.filter(p => p.estado === '1').length;

  // funcion de ventana modal
  const confirmarEliminacion = (id: number) => {
    setPacienteAEliminar(id);
    setMostrarModal(true);
  };

  // boton para atender paciente
  const handleAtender = async (p: { id: number; nombre: string; numero_afiliacion: string }) => {
    try {
      const respuesta = await existePaciente(p.numero_afiliacion);
      await atenderPaciente(p.id);
      navigate('/consultas', {
        state: {
            id: respuesta.paciente_id,                  
            nombre: respuesta.nombre,
            numero_afiliacion: respuesta.numero_afiliacion
        }
      });
    } catch (error: any) {
      await atenderPaciente(p.id);
      navigate('/registro-paciente', {
        state: { nombre: p.nombre, numero_afiliacion: p.numero_afiliacion }
      });
    }
  };

  // boton para quitar paciente con mensaje de exito (Estilo unificado)
  const handleQuitarPaciente = async (id: number) => {
    const ok = await quitarPaciente(id);

    if (ok) {
      setTipoMensaje('exito');
      setMensaje('Paciente eliminado correctamente');
      
      // desaparece despues de 3 segundos
      setTimeout(() => {
        setMensaje(null);
        setTipoMensaje(null);
      }, 3000);
    }
  };
 
  // 1. ESTADO DE CARGA (Pantalla completa)
  if (loading) {
    return (
      <div className="contenedor-pacientes centro-total">
        <Loader2 className="spinner-animado" size={50} />
        <p>Conectando con el servidor...</p>
      </div>
    );
  }

  // 2. ESTADO DE ERROR (Solo mensaje, sin nada más)
  if (error) {
    return (
      <div className="contenedor-espera centro-total">
        <div className="mensaje-estado error-box">
          <AlertCircle size={48} color="#4c4c4c" />
          <h4>Error de conexión</h4>
          <p>{error}</p>
          <p className='minusp'>No se cargó la lista de espera.</p>
          <p className="btn-reintentar" onClick={() => recargarLista(false)}>
            Reintentar conexión
          </p>
        </div>
      </div>
    );
  }

  // 3. RENDERIZADO NORMAL
  return (
    <div className="contenedor-espera">
      <h1>Lista de espera</h1>
      
      <header className="cabecera-espera">
        {/* Solo mostramos el badge si hay pacientes EN ESPERA (estado 1) */}
        {totalEnEspera > 0 && (
          <p className="conteo-badge">
            Hay un total de {totalEnEspera} paciente/s en espera
          </p>
        )}
      </header>

      {/* Tostada flotante con el mismo estilo que RegistroPacientes */}
      {mensaje && (
        <div className={`mensaje-error-flotante_PR ${tipoMensaje}`} style={{ whiteSpace: 'pre-line' }}>
            {tipoMensaje === 'error' ? (
                <AlertCircle size={18} />
            ) : (
                <CheckCircle size={18} />
            )}
            <span>{mensaje}</span>
        </div>
      )}
      
      <div className="zona-contenido">
        {pacientes.length === 0 ? (
          <div className="mensaje-estado error-box">
            <Info className='listaesp' size={38} color="#4c4c4c" />
            <h4>No hay pacientes</h4>
            <p>La lista de espera está vacía. Actualice constantemente.</p>
          </div>
        ) : (
          <div className="tabla-wrapper">
            {isRefreshing && (
              <div className="overlay-carga">
                <Loader2 className="spinner-animado" size={40} />
              </div>
            )}

            <table className={`tabla-pacientes ${isRefreshing ? 'tabla-opaca' : ''}`}>
              <thead>
                <tr>
                  <th className="col-afiliacion">Afiliación</th>
                  <th className="col-nombre">Nombre</th>
                  <th className="col-creado">Creado</th>
                  <th className="col-estado">Estado</th>
                  <th className="col-acciones">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pacientes.map((p) => (
                  <tr key={p.id}>
                    <td className="col-afiliacion">{p.numero_afiliacion}</td>
                    <td className="col-nombre">{p.nombre}</td>
                    <td className="col-creado">{p.creado}</td>
                    <td className="col-estado">
                      <span className={`status-badge ${p.estado === '2' ? 'estado-consulta' : ''}`}>
                        {p.estado === '1' ? 'En espera' : 'En consulta'}
                      </span>
                    </td>
                    <td className="col-acciones">
                      <div className="contenedor-acciones">
                        <div className="grupo-acciones grupo-principal">
                          <button
                            className={`btn-accion btn-atender ${p.estado === '2' ? 'btn-atendido-deshabilitado' : ''}`}
                            onClick={() => p.estado === '1' && handleAtender(p)}
                            disabled={p.estado === '2'}
                          >
                            <CheckCircle size={20} strokeWidth={2.5} />
                            <span className="texto-boton">Atender</span>
                          </button>
                        </div>
                        <div className="divisor-interno"></div>
                        <div className="grupo-acciones">
                          <button 
                           title="Quitar paciente de la lista de espera"
                            className="btn-accion btn-eliminar" 
                            onClick={() => confirmarEliminacion(p.id)}
                            tabIndex={0}
                          >
                            <Trash2 size={20} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="contenedor-botones-flotantes">
        <button 
         title="Refrescar lista"
          className={`btn-flotante-secundario ${isRefreshing ? 'girando' : ''}`} 
          onClick={() => recargarLista(true)} 
          disabled={isRefreshing}
        >
          <RefreshCw size={24} />
        </button>

        <Link to="/añadirpaciente" className="btn-flotante-añadir" ref={botonAnadirRef}>
          <UserPlus size={24} />
          <span>Añadir paciente</span>
        </Link>
      </div>

     {mostrarModal && (
        <div className="modal-overlay">
            <div className="modal-confirmacion">
            <Trash2 size={20} strokeWidth={1.75} />
            <h3>¿Desea quitar al paciente de la lista de espera?</h3>
            <p>Esta acción no se puede deshacer.</p>

            <div className="modal-botones">
                <button
                className="btn-confirmar"
                onClick={async () => {
                    if (pacienteAEliminar !== null) {
                    await handleQuitarPaciente(pacienteAEliminar);
                    }
                    setMostrarModal(false);
                    setPacienteAEliminar(null);
                }}
                >
                Eliminar
                </button>
                <button
                className="btn-cancelar"
                onClick={() => {
                    setMostrarModal(false);
                    setPacienteAEliminar(null);
                }}
                >
                Cancelar
                </button>
            </div>
            </div>
        </div>
        )}
    </div>
  );
}