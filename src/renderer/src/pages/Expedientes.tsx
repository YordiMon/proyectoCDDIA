import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, User, Phone, MapPin, Calendar1, Loader2, Info,
         AlertCircle, RefreshCw, UserPlus, ClipboardList } from 'lucide-react';
import { API_BASE_URL } from '../config'
import '../styles/Expedientes.css'

interface Paciente { 
  id: number
  paciente_id: number,
  nombre: string
  numero_afiliacion: string
  fecha_nacimiento: string
  sexo: string
  tipo_sangre: string
  recibe_donaciones: boolean
  direccion: string
  celular: string
  contacto_emergencia: string
  enfermedades: string
  alergias: string
  cirugias_previas: string
  medicamentos_actuales: string
}

export default function Pacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [paginaActual, setPaginaActual] = useState(1)
  const pacientesPorPagina = 6

  const calcularEdad = (fecha: string) => {
    if (!fecha) return 'N/A'
    const hoy = new Date()
    const nacimiento = new Date(fecha)
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const m = hoy.getMonth() - nacimiento.getMonth()
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--
    }
    return edad
  }

  const formatearFecha = (fecha: string) => {
    if (!fecha) return 'N/A'
    const partes = fecha.split('-')
    if (partes.length !== 3) return fecha
    return `${partes[2]}/${partes[1]}/${partes[0]}`
  }

  const tieneDatos = (texto: string) => {
    return (
      texto && texto.trim().toLowerCase() !== 'ninguna' && texto.trim().toLowerCase() !== 'ninguno'
    )
  }

  const generarResumenClinico = (p: Paciente) => {
    const estadoEnfermedades = tieneDatos(p.enfermedades) ? 'con enfermedades' : 'sin enfermedades'
    const estadoMedicacion = tieneDatos(p.medicamentos_actuales)
      ? 'con medicación actual'
      : 'sin medicación actual'
    const estadoCirugias = tieneDatos(p.cirugias_previas)
      ? 'con cirugías previas'
      : 'sin cirugías previas'
    return `Resumen clínico: ${estadoEnfermedades}, ${estadoMedicacion}, ${estadoCirugias}, tipo de sangre ${p.tipo_sangre}.`
  }

  const obtenerPacientes = async (silencioso = false) => {
    if (!silencioso) setLoading(true);
    setError(null); 
    
    try {
      const response = await fetch(`${API_BASE_URL}/lista_pacientes`);
      if (response.ok) {
        const data = await response.json();
        setPacientes(data);
      } else {
        throw new Error('El servidor respondió con un error');
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor. Verifica tu conexión a internet.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    obtenerPacientes();
  }, [])

  const recargarLista = () => {
    setIsRefreshing(true);
    obtenerPacientes(true);
  }

  const pacientesFiltrados = useMemo(() => {
    return pacientes.filter((p) => {
      const termino = busqueda.toLowerCase()
      return (
        p.nombre.toLowerCase().includes(termino) ||
        p.numero_afiliacion.toLowerCase().includes(termino)
      )
    })
  }, [busqueda, pacientes])

  const indiceUltimo = paginaActual * pacientesPorPagina
  const indicePrimero = indiceUltimo - pacientesPorPagina

  const pacientesPaginados = pacientesFiltrados.slice(indicePrimero, indiceUltimo)

  const totalPaginas = Math.ceil(pacientesFiltrados.length / pacientesPorPagina)

    

  // 1. Pantalla de carga inicial (Full Screen)
  if (loading) {
    return (
      <div className="contenedor-pacientes cenaptro-total">
        <Loader2 className="spinner-animado" size={50} />
        <p>Conectando con el servidor...</p>
      </div>
    );
  }

  // 2. Pantalla de error (Solo el mensaje)
  if (error) {
    return (
      <div className="contenedor-espera centro-total">
        <div className="mensaje-estado error-box">
          <AlertCircle size={48} color="#4c4c4c" />
          <h4>Error de conexión</h4>
          <p>{error}</p>
          <p className='minusp'>No se cargó la lista de expedientes.</p>
          <p className="btn-reintentar" onClick={() => obtenerPacientes()}>
            Reintentar conexión
          </p>
        </div>
      </div>
    );
  }

  // 3. Pantalla normal (Cuando todo está bien)
  return (
    <div className="contenedor-espera">
      <h1>Expedientes clínicos</h1>

      <header className="cabecera-pacientes">
        {pacientes.length > 0 && (
          <span className="conteo-badge">
            Hay un total de {pacientesFiltrados.length} registro/s
          </span>
        )}

        <div className="buscador-wrapper">
          <Search className="icon-search" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o número de afiliación..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-busqueda-moderno"
            autoComplete="off"
          />
        </div>
      </header>

      <div className="zona-contenido">
        {pacientes.length === 0 ? (
          <div className="mensaje-estado vacio-box">
            <Info size={38} color="#4c4c4c" />
            <h4>No hay pacientes</h4>
            <p>
              La lista de expedientes se encuentra vacía actualmente.
              Actualice constantemente.
            </p>
          </div>
        ) : (
          <div className={`lista-grid ${isRefreshing ? 'opacidad-baja' : ''}`}>
              {pacientesPaginados.map((paciente) => (
              <div
                key={paciente.id}
                className="tarjeta-paciente-pro"
                onClick={() =>
                  navigate(`/paciente/${paciente.id}`, {
                    state: { paciente }
                  })
                }
                style={{ cursor: 'pointer' }}
              >
                <div className="tarjeta-header">
                  <div className="avatar-circle">
                    <User size={22} />
                  </div>
                  <div className="id-afiliacion">
                    <span className="nro-seguro">{paciente.numero_afiliacion}</span>
                  </div>
                </div>

                <h3 className="paciente-nombre">{paciente.nombre}</h3>

                <div className="info-secundaria">
                  <span><Phone size={14} /> {paciente.celular}</span>
                  <span><Calendar1 size={14} /> {formatearFecha(paciente.fecha_nacimiento)}</span>
                  <span>({calcularEdad(paciente.fecha_nacimiento)} años)</span>
                </div>

                <div className="info-secundaria">
                  <span><MapPin size={14} /> {paciente.direccion || "Sin dirección registrada"}</span>
                </div>

                <hr className="divisor" />

                <div className="info-secundaria">
                  <p className="texto-clinico" style={{ margin: 0, lineHeight: "1.5" }}>
                    {generarResumenClinico(paciente)}
                  </p>
                </div>

              {/* Badge informativo */}
              <div className="seccion-clinica" >
                <span className="conteo-badge">
                  Abrir tarjeta para más información
                </span>
              </div>

              {/* BOTÓN EXPLÍCITO DE CONSULTA */}
              <div className="acciones-tarjeta">
                <button
                  className="btn-ir-consulta"
                  onClick={(e) => {
                    e.stopPropagation(); 
                    navigate("/consultas", {
                      state: {
                        id: paciente.id,
                        nombre: paciente.nombre,
                        numero_afiliacion: paciente.numero_afiliacion,
                        pacienteRegistrado: true
                      }
                    });
                  }}
                >
                  <ClipboardList size={18} />
                  Nueva consulta
                </button>
              </div>
              
            </div>
          ))}
        </div>
      )}



    </div>          
    
    <div className="paginacion">
            <button className="btn-anterior"
              disabled={paginaActual === 1}
              onClick={() => setPaginaActual(paginaActual - 1)}
            >
              Anterior
            </button>

            <span className="info-pagina">
              Página {paginaActual} de {totalPaginas}
            </span>

            <button className='btn-siguiente'
              disabled={paginaActual === totalPaginas}
              onClick={() => setPaginaActual(paginaActual + 1)}
            >
              Siguiente
            </button>
            
          </div>

    <div className="contenedor-botones-flotantes">
       <div className="contenedor-botones-flotantes">
        <button 
          className={`btn-flotante-secundario ${isRefreshing ? 'girando' : ''}`} 
          onClick={recargarLista} 
          title="Actualizar lista"
          disabled={isRefreshing}
        > 
        <RefreshCw size={24} /> 
        </button> 
        <Link to="/registro-paciente" className="btn-flotante-añadir">
          <UserPlus size={24} />
          <span>Añadir paciente</span>
        </Link>
      </div>
    </div>
    </div>
  );
}