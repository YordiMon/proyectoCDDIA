// src/renderer/src/pages/ListaEspera.tsx
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePacientes } from '../hooks/pacientesEspera'
import { CheckCircle, Info, Trash2, UserPlus, RefreshCcw, Loader2, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import '../styles/ListaEspera.css'
import { existePaciente } from '../services/pacienteservice'


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

  // Foco automático al botón de añadir cuando termina la carga inicial
  useEffect(() => {
    if (!loading && botonAnadirRef.current) {
      botonAnadirRef.current.focus();
    }
  }, [loading]);

  //boton para atender paciente
  const handleAtender = async (p: { id: number; nombre: string; numero_afiliacion: string }) => {
    try {
      const respuesta = await existePaciente(p.numero_afiliacion);

      await atenderPaciente(p.id);

      if (respuesta.existe) {
        navigate('/consultas', {
          state: {
            nombre: p.nombre,
            numero_afiliacion: p.numero_afiliacion,
            pacienteRegistrado: true
          }
        });
      } else {
        navigate('/registro-paciente', {
          state: {
            nombre: p.nombre,
            numero_afiliacion: p.numero_afiliacion
          }
        });
      }

    } catch (error: any) {
      console.error("Error al verificar paciente:", error);
      alert("Error al verificar paciente: " + JSON.stringify(error));
    }
  };

  
  // Se eliminó el window.confirm para una eliminación directa
  const handleQuitar = (id: number) => {
    quitarPaciente(id);
  };
  
  if (loading) return <div className="contenedor-espera"><p>Cargando datos...</p></div>;


  return (
    <div className="contenedor-espera">
      <h1>Lista de espera</h1>
      
      <p className="texto-resumen">
        En este momento hay un total de <span className="contador-azul">{totalEspera}</span> persona(s) esperando su turno para entrar a consulta.
      </p>

      <div className="zona-contenido">
        
        {/* 2. ESTADO DE ERROR (Servidor apagado o error de red) */}
        {error ? (
          <div className="mensaje-estado error-box">
            <AlertCircle size={38} color="#4c4c4c" />
            <h4>Error de conexión</h4>
            <p>{error}</p>
            <p className="btn-reintentar" onClick={() => recargarLista()}>
              Reintentar conexión
            </p>
          </div>
        ) : pacientes.length === 0 ? (
          
          /* 3. ESTADO DE LISTA VACÍA (Servidor funciona, pero no hay datos) */
          <div className="mensaje-estado vacio-box">
            <Info size={38} color="#4c4c4c" />
            <h4>No hay pacientes</h4>
            <p>La lista de espera se encuentra vacía actualmente. Actualice constantemente.</p>
          </div>
        ) : (
          
          /* 4. TABLA DE PACIENTES (Solo se muestra si hay datos y no hay error) */
          <div className="tabla-wrapper">
            {/* Spinner sutil solo sobre la tabla durante recargas */}
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
                            title={p.estado === '1' ? "Atender paciente" : "Paciente ya en consulta"}
                            tabIndex={0}
                          >
                            <CheckCircle size={20} strokeWidth={2.5} />
                            <span className="texto-boton">Atender</span>
                          </button>

                          <button className="btn-accion btn-info" tabIndex={0}>
                            <Info size={20} strokeWidth={2.5} />
                          </button>
                        </div>

                        <div className="divisor-interno"></div>

                        <div className="grupo-acciones">
                          <button 
                            className="btn-accion btn-eliminar" 
                            onClick={() => quitarPaciente(p.id)}
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

      {/* BOTONES FLOTANTES (Siempre visibles) */}
      <div className="contenedor-botones-flotantes">
        <button 
          className={`btn-flotante-secundario ${isRefreshing ? 'girando' : ''}`} 
          onClick={() => recargarLista()} 
          title="Actualizar lista"
          disabled={isRefreshing}
        >
          <RefreshCcw size={24} />
        </button>

        <Link 
          to="/añadirpaciente" 
          className="btn-flotante-añadir"
          ref={botonAnadirRef}
          tabIndex={0} 
        >
          <UserPlus size={24} />
          <span>Añadir paciente</span>
        </Link>
      </div>
    </div>
  );
}