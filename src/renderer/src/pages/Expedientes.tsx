import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  User, 
  Phone, 
  MapPin, 
  Calendar1, 
  Loader2, 
  Info, 
  AlertCircle,
  RefreshCw, 
  UserPlus, 
  ClipboardList
} from 'lucide-react';
import { API_BASE_URL } from '../config'
import '../styles/Expedientes.css'

// ... (Interface Paciente se mantiene igual que la tuya)
interface Paciente { 
  id: number
  paciente_id: 0,
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
  //const [error, setError] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

  const obtenerPacientes = async () => {
    setLoading(true)
    setError(false)
    try {
      const response = await fetch(`${API_BASE_URL}/lista_pacientes`)
      if (response.ok) {
        const data = await response.json()
        setPacientes(data)
      } else {
        throw new Error('Servidor no disponible');
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor. Verifica tu conexión a internet.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    obtenerPacientes()
  }, [])

  const recargarLista = async () => {
    setIsRefreshing(true)
    await obtenerPacientes()
    setIsRefreshing(false)
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

  if (loading) {
    return (
      <div className="contenedor-pacientes centro-total">
        <Loader2 className="spinner-animado" size={50} />
        <p>Conectando con el servidor...</p>
      </div>
    );
  }

  return (
  <div className="contenedor-espera">
    <h1>Expedientes clínicos</h1>

    <header className="cabecera-pacientes">
        {!error && pacientes.length > 0 && (
          <span className="conteo-badge">
            Hay un total de {pacientesFiltrados.length} registros
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
      {error ? (
        <div className="mensaje-estado error-box">
          <AlertCircle size={38} color="#4c4c4c" />
          <h4>Error de conexión</h4>
          <p>{error}</p>
          <p className="btn-reintentar" onClick={obtenerPacientes}>
            Reintentar conexión
          </p>
        </div>
      ) : pacientes.length === 0 ? (
        <div className="mensaje-estado vacio-box">
          <Info size={38} color="#4c4c4c" />
          <h4>No hay pacientes</h4>
          <p>
            La base de datos de expedientes se encuentra vacía actualmente.
            Actualice constantemente.
          </p>
        </div>
      ) : (
        <div className="lista-grid">
          {pacientesFiltrados.map((paciente) => (
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
                  <span className="nro-seguro">
                    {paciente.numero_afiliacion}
                  </span>
                </div>
              </div>

              <h3 className="paciente-nombre">{paciente.nombre}</h3>

              <div className="info-secundaria">
                <span>
                  <Phone size={14} /> {paciente.celular}
                </span>
                <span>
                  <Calendar1 size={14} />{" "}
                  {formatearFecha(paciente.fecha_nacimiento)}
                </span>
                <span>
                  ({calcularEdad(paciente.fecha_nacimiento)} años)
                </span>
              </div>

              <div className="info-secundaria">
                <span>
                  <MapPin size={14} />{" "}
                  {paciente.direccion || "Sin dirección registrada"}
                </span>
              </div>

              <hr className="divisor" />

              <div className="info-secundaria">
                <p
                  className="texto-clinico"
                  style={{ margin: 0, lineHeight: "1.5" }}
                >
                  {generarResumenClinico(paciente)}
                </p>
              </div>

              {/* Badge informativo */}
              <div className="seccion-clinica" style={{ marginTop: "15px" }}>
                <span className="conteo-badge">
                  Abrir tarjeta para más información
                </span>
              </div>

              {/* BOTÓN EXPLÍCITO DE CONSULTA */}
              <div className="acciones-tarjeta">
                <button
                  className="btn-ir-consulta"
                  onClick={(e) => {
                    e.stopPropagation(); // 🔑 evita abrir expediente
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
    <div className="contenedor-botones-flotantes">
       <button className="btn-flotante-secundario" onClick={() => recargarLista()} title="Actualizar lista" > 
        <RefreshCw size={24} /> 
        </button> 
      <Link to="/registro-paciente" className="btn-flotante-añadir">
        <UserPlus size={24} />
        <span>Añadir paciente</span>
      </Link>

          </div>
  </div>
);

}