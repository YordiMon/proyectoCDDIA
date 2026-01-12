// src/renderer/src/pages/ListaEspera.tsx
import { usePacientes } from '../hooks/pacientesEspera';
import { CheckCircle, Info, Trash2 } from 'lucide-react'; 
import '../styles/ListaEspera.css';

export default function ListaEspera() {
  const { pacientes, loading } = usePacientes();

  if (loading) return <p>Cargando pacientes...</p>;

  return (
    <div className="contenedor-espera">
      <h1>Lista de espera</h1>
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
                <span className="status-badge">
                  {p.estado === '1' ? 'En espera' : 'Atendido'}
                </span>
              </td>
              <td className="col-acciones">
                <div className="contenedor-acciones">
                  {/* Grupo 1: Atender e Info */}
                  <div className="grupo-acciones">
                    <button className="btn-accion btn-atender" title="Atender paciente">
                      <CheckCircle size={20} strokeWidth={2.5} />
                    </button>
                    <button className="btn-accion btn-info" title="Más información">
                      <Info size={20} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Línea divisoria interna */}
                  <div className="divisor-interno"></div>

                  {/* Grupo 2: Eliminar */}
                  <div className="grupo-acciones">
                    <button className="btn-accion btn-eliminar" title="Quitar de la lista">
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
  );
}