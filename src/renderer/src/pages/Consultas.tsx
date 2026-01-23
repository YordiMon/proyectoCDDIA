import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Calendar, ChevronLeft, Save } from 'lucide-react'
import '../styles/pacientesReg.css'
import { crearConsulta } from '../services/consultaservice'
import { quitarPacienteDeEspera } from '../services/listaEsperaService'




//const location = useLocation();


interface FormData {
    paciente_id: number
    nombre: string
    numero_afiliacion: string
    fecha_consulta: string
    fecha_display: string // Para mostrar en el header (formato humano)
    motivo: string
    sintomas: string
    tiempo_enfermedad: string
    presion_arterial: string // Unificado
    frecuencia_cardiaca: string
    frecuencia_respiratoria: string
    temperatura: string
    peso: string
    talla: string
    diagnostico: string
    medicamentos_recetados: string
    observaciones: string
}

export default function Consultas() {
    const location = useLocation()
    const navigate = useNavigate()
    const state = (location.state ?? {}) as { id?: number; nombre?: string; numero_afiliacion?: string }

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<FormData>({
        paciente_id: 0,
        nombre: '',
        numero_afiliacion: '',
        fecha_consulta: '',
        fecha_display: '',
        motivo: '',
        sintomas: '',
        tiempo_enfermedad: '',
        presion_arterial: '',
        frecuencia_cardiaca: '',
        frecuencia_respiratoria: '',
        temperatura: '',
        peso: '',
        talla: '',
        diagnostico: '',
        medicamentos_recetados: '',
        observaciones: ''
    })

    // Función para el formato de fecha: "22 de enero de 2026, 11:30 a.m."
    const formatFechaHumana = (date: Date) => {
        const opciones: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        const raw = new Intl.DateTimeFormat('es-MX', opciones).format(date);
        // Ajustamos minúsculas y el formato de p.m./a.m.
        return raw.replace(' a las ', ', ').replace(' p. m.', ' p.m.').replace(' a. m.', ' a.m.');
    }

    useEffect(() => {
        if (!state.id) {
            navigate('/expedientes')
            return
        }

        const now = new Date()
        // Formato ISO para el backend
        const isoFecha = now.toISOString();
        // Formato para mostrar al usuario
        const displayFecha = formatFechaHumana(now);

        setFormData(prev => ({
            ...prev,
            paciente_id: state.id!,
            nombre: state.nombre ?? '',
            numero_afiliacion: state.numero_afiliacion ?? '',
            fecha_consulta: isoFecha,
            fecha_display: displayFecha
        }))
    }, [state, navigate])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleGuardar = async () => {
        if (!formData.diagnostico.trim()) {
            alert('El diagnóstico es obligatorio para finalizar');
            return
        }

        setLoading(true)
        try {
            const consultaData = {
                ...formData,
                // Si tu backend aún espera sistólica/diastólica por separado, 
                // aquí podrías hacer un .split('/') pero si ya es un string, pásalo directo
                presionSistolica: formData.presion_arterial ? parseInt(formData.presion_arterial.split('/')[0]) : undefined,
                presionDiastolica: formData.presion_arterial ? parseInt(formData.presion_arterial.split('/')[1]) : undefined,
                frecuencia_cardiaca: parseInt(formData.frecuencia_cardiaca) || undefined,
                frecuencia_respiratoria: parseInt(formData.frecuencia_respiratoria) || undefined,
                temperatura: parseFloat(formData.temperatura) || undefined,
                peso: parseFloat(formData.peso) || undefined,
                talla: parseFloat(formData.talla) || undefined,
            }

      await crearConsulta(consultaData)
      mostrarMensaje('exito', 'Consulta guardada exitosamente')
      
      setTimeout(() => {
        navigate('/lista-espera')
      }, 2000)

    } catch (error) {
      console.error('Error al guardar consulta:', error)
      mostrarMensaje('error', 'Error al guardar la consulta. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }



  

    return (
        <div className="contenedor-espera">
            {/* Header principal alineado */}
            <header className='header'>
                <button onClick={() => navigate('/expedientes')} className="btn-volver-minimal" type="button">
                    <ChevronLeft size={32} strokeWidth={2.5} />
                </button>
                <h1 style={{ margin: 0 }}>Consulta</h1>
            </header>

            <section>
                {/* Header de Info del Paciente con orden solicitado */}
                <header className="perfil-info">
                    <div className="avatar-circle">
                        <Calendar size={32} />
                    </div>
                    <div className="nombre-afiliacion">
                        <h2>{formData.fecha_display}</h2>
                        <p>{formData.nombre} • {formData.numero_afiliacion}</p>
                    </div>
                </header>

                <hr className="divisor-detalle" />

                <div className='fila-form'>
                  <div className="campo-form">
                    <label>Motivo de consulta</label>
                    <textarea name="motivo" rows={2} placeholder="Motivo..." value={formData.motivo} onChange={handleInputChange} />
                </div>

                <div className="campo-form">
                        <label>Síntomas</label>
                        <textarea name="sintomas" rows={2} placeholder="Síntomas..." value={formData.sintomas} onChange={handleInputChange} />
                    </div>

                </div>
                
                <div className="campo-form">
                        <label>Tiempo de evolución</label>
                        <textarea name="tiempo_enfermedad" rows={1} placeholder="¿Desde cuándo?" value={formData.tiempo_enfermedad} onChange={handleInputChange} />
                    </div>

                <hr className="divisor-detalle" />

                <div className="fila-form">
                    <div className="campo-form">
                        <label>Presión Arterial</label>
                        <input type="text" name="presion_arterial" placeholder="Ej: 120/80" value={formData.presion_arterial} onChange={handleInputChange} />
                    </div>
                    <div className="campo-form">
                        <label>Frec. Cardiaca (LPM)</label>
                        <input type="number" name="frecuencia_cardiaca" placeholder="72" value={formData.frecuencia_cardiaca} onChange={handleInputChange} />
                    </div>
                    <div className="campo-form">
                        <label>Frec. Respiratoria (RPM)</label>
                        <input type="number" name="frecuencia_respiratoria" placeholder="18" value={formData.frecuencia_respiratoria} onChange={handleInputChange} />
                    </div>
                </div>

                <div className="fila-form">
                    <div className="campo-form">
                        <label>Temperatura (°C)</label>
                        <input type="number" step="0.1" name="temperatura" placeholder="36.5" value={formData.temperatura} onChange={handleInputChange} />
                    </div>
                    <div className="campo-form">
                        <label>Peso (kg)</label>
                        <input type="number" step="0.1" name="peso" placeholder="70" value={formData.peso} onChange={handleInputChange} />
                    </div>
                    <div className="campo-form">
                        <label>Talla (cm)</label>
                        <input type="number" name="talla" placeholder="170" value={formData.talla} onChange={handleInputChange} />
                    </div>
                </div>

                <hr className="divisor-detalle" />

                <div className='fila-form'>
                  <div className="campo-form">
                    <label>Diagnóstico</label>
                    <textarea name="diagnostico" rows={2} placeholder="Diagnóstico definitivo..." value={formData.diagnostico} onChange={handleInputChange} />
                </div>

                <div className="campo-form">
                    <label>Medicamentos recetados</label>
                    <textarea name="medicamentos_recetados" rows={2} placeholder="Lista de medicamentos..." value={formData.medicamentos_recetados} onChange={handleInputChange} />
                </div>

                </div>

                <div className="campo-form">
                    <label>Observaciones</label>
                    <textarea name="observaciones" rows={2} placeholder="Notas adicionales..." value={formData.observaciones} onChange={handleInputChange} />
                </div>

                {/* Botón Flotante */}
                <div className="contenedor-botones-flotantes">
                    <button type="button" className="btn-flotante-registrar" onClick={handleGuardar} disabled={loading}>
                        <Save size={20} />
                        {loading ? 'Guardando...' : 'Finalizar Consulta'}
                    </button>
                </div>
            </section>
        </div>
    )
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
          onClick={handleGuardar          }
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
        
      </div>
    </div>
  )
}