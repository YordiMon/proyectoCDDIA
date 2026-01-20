import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeft, AlertCircle, CheckCircle } from 'lucide-react'
import '../styles/consulta.css'
import { crearConsulta } from '../services/consultaservice'

interface FormData {
  paciente_id: number
  nombre: string
  numero_afiliacion: string
  fecha_consulta: string
  motivo: string
  sintomas: string
  tiempo_enfermedad: string
  presionSistolica: string
  presionDiastolica: string
  frecuencia_cardiaca: string
  frecuencia_respiratoria: string
  temperatura: string
  peso: string
  talla: string
  diagnostico: string
  tratamiento: string
  medicamentos_recetados: string
  observaciones: string
}

export default function Consultas() {
  const location = useLocation()
  const navigate = useNavigate()

  const state = (location.state ?? {}) as { 
    id?: number
    nombre?: string
    numero_afiliacion?: string 
  }

  const [fechaEvaluacion, setFechaEvaluacion] = useState('')
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: 'error' | 'exito'; texto: string } | null>(null)

  const [formData, setFormData] = useState<FormData>({
    paciente_id: 0,
    nombre: '',
    numero_afiliacion: '',
    fecha_consulta: '',
    motivo: '',
    sintomas: '',
    tiempo_enfermedad: '',
    presionSistolica: '',
    presionDiastolica: '',
    frecuencia_cardiaca: '',
    frecuencia_respiratoria: '',
    temperatura: '',
    peso: '',
    talla: '',
    diagnostico: '',
    tratamiento: '',
    medicamentos_recetados: '',
    observaciones: ''
  })

  const mostrarMensaje = (tipo: 'error' | 'exito', texto: string) => {
    setMensaje({ tipo, texto })
    setTimeout(() => setMensaje(null), 4000)
  }

  function formatToTimeZone(date: Date, timeZone: string) {
    const dtf = new Intl.DateTimeFormat('en-GB', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })

    const parts = dtf.formatToParts(date).reduce((acc, p) => {
      acc[p.type] = p.value
      return acc
    }, {} as Record<string, string>)

    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`
  }

  //  useEffect(() => {
    //if (!state.id) {
    //  mostrarMensaje('error', 'Acceso inválido a consulta')
    //  navigate('/expedientes')
    //  return
   // }

    const now = new Date()
    const hermosillo = formatToTimeZone(now, 'America/Hermosillo')

    setFechaEvaluacion(hermosillo)

    setFormData(prev => ({
      ...prev,
      paciente_id: state.id!,
      nombre: state.nombre ?? '',
      numero_afiliacion: state.numero_afiliacion ?? '',
      fecha_consulta: hermosillo
    }))
  }, [state])






  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

    const handleGuardar = async () => {
    if (!formData.paciente_id) {
      mostrarMensaje('error', 'No se ha seleccionado un paciente válido')
      return
    }

    if (!formData.nombre.trim() || !formData.numero_afiliacion.trim()) {
      mostrarMensaje('error', 'Nombre y número de afiliación son obligatorios')
      return
    }



    setLoading(true)
    try {
      const consultaData = {
        paciente_id: formData.paciente_id,
        fecha_consulta: formData.fecha_consulta,
        motivo: formData.motivo || undefined,
        sintomas: formData.sintomas || undefined,
        tiempo_enfermedad: formData.tiempo_enfermedad || undefined,
        presionSistolica: formData.presionSistolica ? parseInt(formData.presionSistolica) : undefined,
        presionDiastolica: formData.presionDiastolica ? parseInt(formData.presionDiastolica) : undefined,
        frecuencia_cardiaca: formData.frecuencia_cardiaca ? parseInt(formData.frecuencia_cardiaca) : undefined,
        frecuencia_respiratoria: formData.frecuencia_respiratoria ? parseInt(formData.frecuencia_respiratoria) : undefined,
        temperatura: formData.temperatura ? parseFloat(formData.temperatura) : undefined,
        peso: formData.peso ? parseFloat(formData.peso) : undefined,
        talla: formData.talla ? parseFloat(formData.talla) : undefined,
        diagnostico: formData.diagnostico || undefined,
        tratamiento: formData.tratamiento || undefined,
        medicamentos_recetados: formData.medicamentos_recetados || undefined,
        observaciones: formData.observaciones || undefined
      }

      await crearConsulta(consultaData)
      mostrarMensaje('exito', 'Consulta guardada exitosamente')
      
      setTimeout(() => {
        navigate('/expedientes')
      }, 2000)

    } catch (error) {
      console.error('Error al guardar consulta:', error)
      mostrarMensaje('error', 'Error al guardar la consulta. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleFinalizar = async () => {
    if (!formData.diagnostico.trim()) {
      mostrarMensaje('error', 'El diagnóstico es obligatorio para finalizar')
      return
    }
    await handleGuardar()
  }

  

  return (
    <div className="consulta-container">
      <header>
        <button
          onClick={(e) => {
            e.preventDefault()
            navigate('/expedientes')
          }}
          className="btn-volver-minimal"
          type="button"
        >

          <ChevronLeft size={32} strokeWidth={2.5} />
        </button>
        <h1>Consulta</h1>
      </header>

      <section>
        <h2>Detalles de la consulta</h2>

        <h3>Datos personales</h3>
        <div className="field">
          <label>Nombre Completo</label>
          <input 
            type="text" 
            name="nombre" 
            maxLength={60} 
            required 
            value={formData.nombre}
            onChange={handleInputChange}
            placeholder="Nombre del paciente"
          />
        </div>
        <div className="field">
          <label>Número de afiliación</label>
          <input 
            type="text" 
            name="numero_afiliacion" 
            maxLength={8} 
            required 
            value={formData.numero_afiliacion}
            onChange={handleInputChange}
            placeholder="Ej. SS-98065"
          />
        </div>  

        <h3>Información General de la consulta</h3>

        <div className="field">
          <label>Fecha de evaluación</label>
          <input 
            type="datetime-local" 
            name="fecha_consulta" 
            value={formData.fecha_consulta} 
            readOnly 
          />
        </div>
        <div className="field">
          <label>Motivo de consulta</label>
          <textarea 
            name="motivo" 
            rows={4} 
            placeholder="Describa el motivo de la consulta" 
            title="Motivo de consulta"
            value={formData.motivo}
            onChange={handleInputChange}
          />
        </div>
        <div className="field">
          <label>Síntomas</label>
          <textarea 
            name="sintomas" 
            rows={4} 
            placeholder="Describa los síntomas" 
            title="Síntomas"
            value={formData.sintomas}
            onChange={handleInputChange}
          />
        </div>
        <div className="field">
          <label>Tiempo de evolución</label>
          <textarea 
            name="tiempo_enfermedad" 
            rows={4} 
            placeholder="Tiempo de evolución" 
            title="Tiempo de evolución"
            value={formData.tiempo_enfermedad}
            onChange={handleInputChange}
          />
        </div>

        <h3>Exploración física</h3>
        <div className="field">
          <label>Presión arterial (mmHg)</label>
          <div className="radio-group">
            <input
              type="number"
              name="presionSistolica"
              placeholder="Sistólica"
              title="Presión sistólica"
              min={50}
              max={250}
              value={formData.presionSistolica}
              onChange={handleInputChange}
            />
            <span>/</span>
            <input
              type="number"
              name="presionDiastolica"
              placeholder="Diastólica"
              title="Presión diastólica"
              min={30}
              max={150}
              value={formData.presionDiastolica}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="field">
          <label>Frecuencia cardiaca (lpm)</label>
          <input
            type="number"
            name="frecuencia_cardiaca"
            min={30}
            max={220}
            placeholder="Ej. 72"
            title="Frecuencia cardiaca"
            value={formData.frecuencia_cardiaca}
            onChange={handleInputChange}
          />
        </div>

        <div className="field">
          <label>Frecuencia respiratoria (rpm)</label>
          <input
            type="number"
            name="frecuencia_respiratoria"
            min={5}
            max={60}
            placeholder="Ej. 18"
            title="Frecuencia respiratoria"
            value={formData.frecuencia_respiratoria}
            onChange={handleInputChange}
          />
        </div>

        <div className="field">
          <label>Temperatura (°C)</label>
          <input
            type="number"
            name="temperatura"
            step="0.1"
            min={30}
            max={45}
            placeholder="Ej. 36.5"
            title="Temperatura"
            value={formData.temperatura}
            onChange={handleInputChange}
          />
        </div>

        <div className="field">
          <label>Peso (kg)</label>
          <input
            type="number"
            name="peso"
            step="0.1"
            min={1}
            placeholder="Ej. 70.5"
            title="Peso"
            value={formData.peso}
            onChange={handleInputChange}
          />
        </div>

        <div className="field">
          <label>Talla (cm)</label>
          <input
            type="number"
            name="talla"
            step="0.1"
            min={30}
            placeholder="Ej. 170"
            title="Talla"
            value={formData.talla}
            onChange={handleInputChange}
          />
        </div>

        <h3>Diagnóstico y tratamiento</h3>

        <label>Diagnóstico</label>
        <div className="field">
          <textarea 
            name="diagnostico" 
            rows={4} 
            placeholder="Describa el diagnóstico" 
            title="Diagnóstico"
            value={formData.diagnostico}
            onChange={handleInputChange}
          />
        </div>

        <label>Tratamiento</label>
        <div className="field">
          <textarea 
            name="tratamiento" 
            rows={4} 
            placeholder="Describa el tratamiento" 
            title="Tratamiento"
            value={formData.tratamiento}
            onChange={handleInputChange}
          />
        </div>
        <label>Medicamentos recetados</label>
        <div className="field">
          <textarea 
            name="medicamentos_recetados" 
            rows={4} 
            placeholder="Liste los medicamentos recetados" 
            title="Medicamentos recetados"
            value={formData.medicamentos_recetados}
            onChange={handleInputChange}
          />
        </div>
        <label>Observaciones</label>
        <div className="field">
          <textarea 
            name="observaciones" 
            rows={4} 
            placeholder="Añada observaciones adicionales" 
            title="Observaciones"
            value={formData.observaciones}
            onChange={handleInputChange}
          />
        </div>

        {/* Mensaje de error o éxito */}
        {mensaje && (
          <div className={`mensaje-estado ${mensaje.tipo === 'error' ? 'error-box' : 'exito-box'}`}>
            {mensaje.tipo === 'error' ? (
              <AlertCircle size={20} />
            ) : (
              <CheckCircle size={20} />
            )}
            <span>{mensaje.texto}</span>
          </div>
        )}
      </section>

      <div className="contenedor-botones-consulta">
        <button 
          className="btn-consulta btn-guardar" 
          onClick={handleGuardar}
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
        <button 
          className="btn-consulta btn-finalizar" 
          onClick={handleFinalizar}
          disabled={loading}
        >
          {loading ? 'Finalizando...' : 'Finalizar consulta'}
        </button>
      </div>
    </div>
  )
}