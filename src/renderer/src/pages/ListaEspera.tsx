// src/renderer/src/pages/ListaEspera.tsx
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePacientes } from '../hooks/pacientesEspera';
import { CheckCircle, Info, Trash2, UserPlus, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/ListaEspera.css';

export default function ListaEspera() {
  const { 
    pacientes, 
    totalEspera, 
    loading, 
    atenderPaciente, 
    quitarPaciente, 
    recargarLista 
  } = usePacientes();
  const navigate = useNavigate(); 
  const botonAnadirRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!loading && botonAnadirRef.current) {
      botonAnadirRef.current.focus();
    }
  }, [loading]);

  // ahora recibe el objeto paciente, marca como atendido y navega a /consultas pasando datos por state
  const handleAtender = (p: { id: number; nombre: string; numero_afiliacion: string }) => {
    atenderPaciente(p.id);
    navigate('/consultas', { state: { nombre: p.nombre, numero_afiliacion: p.numero_afiliacion } });
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
        En este momento hay un total de <span className="contador-azul">{totalEspera}</span> persona(s) esperando su turno para entrar a consulta (la lista de espera puede estar desactualizada).
      </p>

      <table className="tabla-pacientes">
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
                      onClick={() => handleQuitar(p.id)}
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

      <div className="contenedor-botones-flotantes">
        <button 
          className="btn-flotante-secundario" 
          onClick={() => recargarLista()} 
          title="Actualizar lista"
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