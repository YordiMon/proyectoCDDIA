// src/renderer/src/pages/ListaEspera.tsx
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePacientes } from '../hooks/pacientesEspera'
import '../styles/ListaEspera.css'
import { existePaciente } from '../services/pacienteservice'
import { 
  CheckCircle, 
  Info, 
  Trash2, 
  UserPlus, 
  RefreshCcw, 
  Loader2, 
  AlertCircle
 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/ListaEspera.css';

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

  useEffect(() => {
    if (!loading && botonAnadirRef.current) {
      botonAnadirRef.current.focus();
    }
  }, [loading]);

  //boton para atender paciente
  const handleAtender = async (p: { id: number; nombre: string; numero_afiliacion: string }) => {
    try {
      // Consultar datos reales del paciente en la base
      const respuesta = await existePaciente(p.numero_afiliacion);

      // Cambiar estado en lista de espera
      await atenderPaciente(p.id);

      // Si llegó hasta aquí, el paciente existe en BD
      navigate('/consultas', {
        state: {
          id: respuesta.paciente_id,
          nombre: respuesta.nombre,
          numero_afiliacion: respuesta.numero_afiliacion,
          pacienteRegistrado: true
        }
      });

    } catch (error: any) {
      console.error("Error al verificar paciente:", error);

      // Si la API devolvió 404 → el paciente no existe aún
      navigate('/registro-paciente', {
        state: {
          nombre: p.nombre,
          numero_afiliacion: p.numero_afiliacion
        }
      });
    }
  };



  
  // Se eliminó el window.confirm para una eliminación directa
  const handleQuitar = (id: number) => {
    quitarPaciente(id);
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
      
      <p className="texto-resumen">
        En este momento hay un total de <span className="contador-azul">{totalEspera}</span> persona(s) esperando su turno para entrar a consulta.
      </p>

      <div className="zona-contenido">
        
        {error ? (
          <div className="mensaje-estado error-box">
            <AlertCircle size={38} color="#4c4c4c" />
            <h4>Error de conexión</h4>
            <p>{error}</p>
            {/* AQUÍ: Al pasar false, forzamos el loading total */}
            <p className="btn-reintentar" onClick={() => recargarLista(false)}>
              Reintentar conexión
            </p>
          </div>
        ) : pacientes.length === 0 ? (
          
          <div className="mensaje-estado vacio-box">
            <Info size={38} color="#4c4c4c" />
            <h4>No hay pacientes</h4>
            <p>La lista de espera se encuentra vacía actualmente. Actualice constantemente.</p>
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

      <div className="contenedor-botones-flotantes">
        {/* El botón de actualización sutil sigue pasando true por defecto */}
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