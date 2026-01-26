import { useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePacientes } from '../hooks/pacientesEspera'
import { 
  CheckCircle, 
  Info, 
  Trash2, 
  UserPlus, 
  RefreshCcw, 
  Loader2, 
  AlertCircle,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/ListaEspera.css';
import { existePaciente } from '../services/pacienteservice';

export default function ListaEspera() {
  const {
    pacientes,
    totalEspera,
    loading,
    isRefreshing,
    error,
    
    atenderPaciente,
    quitarPaciente,
    recargarLista
  } = usePacientes()
  
  const navigate = useNavigate()
  const botonAnadirRef = useRef<HTMLAnchorElement>(null)

  // --- NUEVA LÓGICA DE FILTRADO ---
  const [areaSeleccionada, setAreaSeleccionada] = useState<string>('General');

  // Obtener áreas únicas de la lista de pacientes
  const areasDisponibles = useMemo(() => {
    const areas = pacientes.map(p => p.area).filter(Boolean);
    return ['General', ...new Set(areas)];
  }, [pacientes]);

  // Filtrar pacientes según el área seleccionada
  const pacientesFiltrados = useMemo(() => {
    if (areaSeleccionada === 'General') return pacientes;
    return pacientes.filter(p => p.area === areaSeleccionada);
  }, [pacientes, areaSeleccionada]);
  // --------------------------------

  useEffect(() => {
    if (!loading && botonAnadirRef.current) {
      botonAnadirRef.current.focus();
    }
  }, [loading]);

  // Mensaje temporal (en caso de error o éxito)
  const [mensaje, setMensaje] = useState<string | null>(null);



  //boton para atender paciente
  const handleAtender = async (p: { id: number; nombre: string; numero_afiliacion: string }) => {
    try {
      const respuesta = await existePaciente(p.numero_afiliacion);
      await atenderPaciente(p.id);
      navigate('/consultas', {
        state: {
          id: respuesta.paciente_id,
          nombre: respuesta.nombre,
          numero_afiliacion: respuesta.numero_afiliacion,
          pacienteRegistrado: true
        }
      });
    } catch (error: any) {
      setMensaje("Error al verificar paciente:", error);

      // Si la API devolvió 404 → el paciente no existe aún
      await atenderPaciente(p.id);
      navigate('/registro-paciente', {
        state: { nombre: p.nombre, numero_afiliacion: p.numero_afiliacion }
      });
    }
  };


  //boton para quitar paciente con messaje de exito
   const handleQuitarPaciente = async (id: number) => {
  const ok = await quitarPaciente(id);

  if (ok) {
    setMensaje('Paciente eliminado correctamente');

    //desaparecer después de 3 segundos
    setTimeout(() => {
      setMensaje(null);
    }, 3000);
  }
};
 

  // 1. ESTADO DE CARGA (Pantalla completa)
  // Al darle a Reintentar, loading vuelve a ser true y entra aquí inmediatamente
  if (loading) {
    return (
      <div className="contenedor-espera centro-total">
        <Loader2 className="spinner-animado" size={50} />
        <p>Conectando con el servidor...</p>
      </div>
    );
  }

  return (
    <div className="contenedor-espera">
      <h1>Lista de espera</h1>
      
        {mensaje && (
          <div className="mensaje-flotante exito">
            {mensaje}
          </div>
        )}


      <p className="texto-resumen">
        Hay un total de <span className="contador-azul">{pacientesFiltrados.length}</span> paciente(s) en espera en <strong>{areaSeleccionada}</strong>.
      </p>

      {/* --- MENÚ DE FILTROS (BOTONES) --- */}
      <div className="menu-filtros-areas">
        {areasDisponibles.map((area) => (
          <button
            key={area}
            className={`btn-filtro-area ${areaSeleccionada === area ? 'activo' : ''}`}
            onClick={() => setAreaSeleccionada(area)}
          >
            {area === 'General' ? <Users size={16} /> : null}
            {area}
          </button>
        ))}
      </div>

      <div className="zona-contenido">
        {error ? (
          <div className="mensaje-estado error-box">
            <AlertCircle size={38} color="#4c4c4c" />
            <h4>Error de conexión</h4>
            <p>{error}</p>
            <p className="btn-reintentar" onClick={() => recargarLista(false)}>
              Reintentar conexión
            </p>
          </div>
        ) : pacientesFiltrados.length === 0 ? (
          <div className="mensaje-estado vacio-box">
            <Info size={38} color="#4c4c4c" />
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
                  {/* Solo mostrar encabezado de Area si es General */}
                  {areaSeleccionada === 'General' && <th className="col-creado">Area</th>}
                  <th className="col-estado">Estado</th>
                  <th className="col-acciones">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pacientesFiltrados.map((p) => (
                  <tr key={p.id}>
                    <td className="col-afiliacion">{p.numero_afiliacion}</td>
                    <td className="col-nombre">{p.nombre}</td>
                    <td className="col-creado">{p.creado}</td>
                    {/* Solo mostrar celda de Area si es General */}
                    {areaSeleccionada === 'General' && <td className="col-creado">{p.area}</td>}
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
                            className="btn-accion btn-eliminar" 
                            onClick={() => handleQuitarPaciente(p.id)}
                            //disabled={p.estado === '2'}

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
          className={`btn-flotante-secundario ${isRefreshing ? 'girando' : ''}`} 
          onClick={() => recargarLista(true)} 
          disabled={isRefreshing}
        >
          <RefreshCcw size={24} />
        </button>

        <Link to="/añadirpaciente" className="btn-flotante-añadir" ref={botonAnadirRef}>
          <UserPlus size={24} />
          <span>Añadir paciente</span>
        </Link>
      </div>
    </div>
  );
}