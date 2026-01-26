import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Calendar, AlertCircle, ChevronLeft, Save } from 'lucide-react'
import '../styles/pacientesReg.css'
import { crearConsulta } from '../services/consultaservice'
import '../styles/consulta.css'

interface FormData {
    paciente_id: number
    nombre: string
    numero_afiliacion: string
    fecha_consulta: string
    fecha_display: string
    motivo: string
    sintomas: string
    tiempo_enfermedad: string
    presion_arterial: string 
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
    
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [tipoMensaje, setTipoMensaje] = useState<'error' | 'exito' | null>(null);
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

    const formatFechaHumana = (date: Date) => {
        const opciones: Intl.DateTimeFormatOptions = {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true,
            timeZone: 'America/Hermosillo'
        };
        return new Intl.DateTimeFormat('es-MX', opciones).format(date);
    }

    const mostrarMensaje = (tipo: 'error' | 'exito', texto: string) => {
        setTipoMensaje(tipo);
        setMensaje(texto);
        setTimeout(() => { setMensaje(null); setTipoMensaje(null); }, 4000);
    };

    useEffect(() => {
        if (!state.id) {
            navigate('/expedientes');
            return;
        }

        const now = new Date();
        
        // --- SOLUCIÓN HORA LOCAL ---
        // Obtenemos la fecha local en formato ISO pero sin convertir a UTC (Z)
        const tzOffset = now.getTimezoneOffset() * 60000;
        const localISOTime = new Date(now.getTime() - tzOffset).toISOString().slice(0, -1);
        
        const displayFecha = formatFechaHumana(now);

        setFormData(prev => ({
            ...prev,
            paciente_id: state.id!,
            nombre: state.nombre ?? '',
            numero_afiliacion: state.numero_afiliacion ?? '',
            fecha_consulta: localISOTime,
            fecha_display: displayFecha
        }))
    }, [state, navigate])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleGuardar = async () => {
        if (!formData.diagnostico.trim()) {
            mostrarMensaje('error', 'El diagnóstico es obligatorio');
            return;
        }

        setLoading(true)
        try {
            // Adaptamos los datos para el backend
            const consultaData = {
                ...formData,
                // Mapeo de campos numéricos
                frecuencia_cardiaca: parseInt(formData.frecuencia_cardiaca) || undefined,
                frecuencia_respiratoria: parseInt(formData.frecuencia_respiratoria) || undefined,
                temperatura: parseFloat(formData.temperatura) || undefined,
                peso: parseFloat(formData.peso) || undefined,
                talla: parseFloat(formData.talla) || undefined,
                presion: formData.presion_arterial // Enviamos como 'presion' para el backend
            }

            await crearConsulta(consultaData)
            mostrarMensaje('exito', 'Consulta guardada exitosamente')
            setTimeout(() => navigate('/lista-espera'), 2000)

        } catch (error) {
            console.error(error)
            mostrarMensaje('error', 'Error al guardar la consulta')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="contenedor-espera">
            <header className='header'>
                <button onClick={() => navigate(-1)} className="btn-volver-minimal" type="button">
                    <ChevronLeft size={32} strokeWidth={2.5} />
                </button>
                <h1 style={{ margin: 0 }}>Nueva Consulta</h1>
            </header>

            <section>
                <header className="perfil-info">
                    <div className="avatar-circle"><Calendar size={32} /></div>
                    <div className="nombre-afiliacion">
                        <h2>{formData.fecha_display}</h2>
                        <p>{formData.nombre} • {formData.numero_afiliacion}</p>
                    </div>
                </header>

                <hr className="divisor-detalle" />

                <div className='fila-form'>
                    <div className="campo-form">
                        <label>Motivo de consulta</label>
                        <textarea name="motivo" rows={2} value={formData.motivo} onChange={handleInputChange} />
                    </div>
                    <div className="campo-form">
                        <label>Síntomas</label>
                        <textarea name="sintomas" rows={2} value={formData.sintomas} onChange={handleInputChange} />
                    </div>
                </div>

                <div className="campo-form">
                    <label>Tiempo de evolución</label>
                    <input type="text" name="tiempo_enfermedad" value={formData.tiempo_enfermedad} onChange={handleInputChange} />
                </div>

                <hr className="divisor-detalle" />

                <div className="fila-form">
                    <div className="campo-form">
                        <label>Presión Arterial</label>
                        <input type="text" name="presion_arterial" placeholder="120/80" value={formData.presion_arterial} onChange={handleInputChange} />
                    </div>
                    <div className="campo-form">
                        <label>Frec. Cardiaca</label>
                        <input type="number" name="frecuencia_cardiaca" value={formData.frecuencia_cardiaca} onChange={handleInputChange} />
                    </div>
                    <div className="campo-form">
                        <label>Frec. Respiratoria</label>
                        <input type="number" name="frecuencia_respiratoria" value={formData.frecuencia_respiratoria} onChange={handleInputChange} />
                    </div>
                </div>

                <div className="fila-form">
                    <div className="campo-form">
                        <label>Temp (°C)</label>
                        <input type="number" step="0.1" name="temperatura" value={formData.temperatura} onChange={handleInputChange} />
                    </div>
                    <div className="campo-form">
                        <label>Peso (kg)</label>
                        <input type="number" step="0.1" name="peso" value={formData.peso} onChange={handleInputChange} />
                    </div>
                    <div className="campo-form">
                        <label>Talla (cm)</label>
                        <input type="number" name="talla" value={formData.talla} onChange={handleInputChange} />
                    </div>
                </div>

                <hr className="divisor-detalle" />

                <div className="campo-form">
                    <label>Diagnóstico</label>
                    <textarea name="diagnostico" rows={2} value={formData.diagnostico} onChange={handleInputChange} />
                </div>

                <div className="campo-form">
                    <label>Medicamentos</label>
                    <textarea name="medicamentos_recetados" rows={2} value={formData.medicamentos_recetados} onChange={handleInputChange} />
                </div>

                <div className="campo-form">
                    <label>Observaciones</label>
                    <textarea name="observaciones" rows={2} value={formData.observaciones} onChange={handleInputChange} />
                </div>

                {mensaje && (
                    <div className={`mensaje-flotante_C ${tipoMensaje}`}>
                        <AlertCircle size={18} />
                        <span>{mensaje}</span>
                    </div>
                )}

                <div className="contenedor-botones-flotantes">
                    <button type="button" className="btn-flotante-registrar" onClick={handleGuardar} disabled={loading}>
                        <Save size={20} />
                        {loading ? 'Guardando...' : 'Finalizar Consulta'}
                    </button>
                </div>
            </section>
        </div>
    )
}