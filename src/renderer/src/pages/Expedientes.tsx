import { useState, useEffect, useMemo } from 'react'
import { Search, User, RefreshCw, Phone, AlertTriangle, MapPin, Calendar1, UserPlus, ClipboardList } from 'lucide-react'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../config'
import '../styles/Expedientes.css'

interface Paciente {
  id: number
  nombre: string
  numero_afiliacion: string
  celular: string
  tipo_sangre: string
  enfermedades: string
  alergias: string
  cirugias_previas: string
  medicamentos_actuales: string
  sexo: string
  fecha_nacimiento: string
  direccion: string
}

export default function Pacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Calcular edad
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

  // Formatear fecha a DD/MM/AAAA
  const formatearFecha = (fecha: string) => {
    if (!fecha) return 'N/A'
    const partes = fecha.split('-')
    if (partes.length !== 3) return fecha
    return `${partes[2]}/${partes[1]}/${partes[0]}`
  }

  // Helper para determinar si tiene algo (Enfermedad, Cirugía, etc.)
  const tieneDatos = (texto: string) => {
    return (
      texto && texto.trim().toLowerCase() !== 'ninguna' && texto.trim().toLowerCase() !== 'ninguno'
    )
  }

  // Generador del párrafo resumen
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
        setError(true)
      }
    } catch (err) {
      setError(true)
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

  return (
    <div className="contenedor-pacientes">
      <header className="cabecera-pacientes">
        <div className="titulo-fila">
          <h1>Expedientes clínicos</h1>
          <span className="conteo-badge">{pacientesFiltrados.length} Registros</span>
        </div>
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

      {loading ? (
        <div className="estado-mensaje">
          <div className="spinner"></div>
          <p>Cargando base de datos...</p>
        </div>
      ) : error ? (
        <div className="estado-mensaje error">
          <AlertTriangle size={40} />
          <p>No se pudo establecer conexión con el servidor</p>
          <button onClick={obtenerPacientes} className="btn-reintentar">
            <RefreshCw size={16} /> Reintentar
          </button>
        </div>
      ) : (
        <div className="lista-grid">
          {pacientesFiltrados.map((paciente) => (
            <div key={paciente.id} className="tarjeta-paciente-pro">
              <div className="tarjeta-header">
                <div className="avatar-circle">
                  <User size={22} />
                </div>
                <div className="id-afiliacion">
                  <span className="nro-seguro">{paciente.numero_afiliacion}</span>
                </div>
              </div>

              <h3 className="paciente-nombre">{paciente.nombre}</h3>

              {/* Información Contacto y Edad */}
              <div className="info-secundaria">
                <span>
                  <Phone size={14} /> {paciente.celular}
                </span>
                <span>
                  <Calendar1 size={14} /> {formatearFecha(paciente.fecha_nacimiento)}
                </span>
                <span>({calcularEdad(paciente.fecha_nacimiento)} años)</span>
              </div>

              {/* Dirección */}
              <div className="info-secundaria">
                <span>
                  <MapPin size={14} /> {paciente.direccion || 'Sin dirección registrada'}
                </span>
              </div>

              <hr className="divisor" />

              {/* Párrafo de Resumen Clínico (Sin Iconos) */}
              <div className="info-secundaria">
                <p className="texto-clinico" style={{ margin: 0, lineHeight: '1.5' }}>
                  {generarResumenClinico(paciente)}
                </p>
              </div>

              {/* Botón Badge */}
              <span className="conteo-badge"> Abrir tarjeta para más información </span>
            </div>
          ))}
        </div>
      )}
       {/* BOTONES FLOTANTES (Siempre visibles) */}
      <div className="contenedor-botones-flotantes">
        <button 
          className={`btn-flotante-secundario ${isRefreshing ? 'girando' : ''}`} 
          onClick={() => recargarLista()} 
          title="Actualizar lista"
          disabled={isRefreshing}
        >
          <RefreshCw size={24} />
        </button>

        <Link 
          to="/consultas" 
          className="btn-flotante-consulta"
          title="Ir a consulta"
        >
          <ClipboardList size={24} />
          <span>Nueva consulta</span>
        </Link>

        <Link 
          to="/registro-paciente" 
          className="btn-flotante-registro"
          title="Registrar nuevo paciente"
        >
          <UserPlus size={24} />
          <span>Nuevo paciente</span>
        </Link>
      </div>
    </div>
  )
}
