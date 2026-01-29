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
        // Damos 5 segundos para que puedan leer la lista de faltantes
        setTimeout(() => { setMensaje(null); setTipoMensaje(null); }, 5000);
    };

    useEffect(() => {
        if (!state.id) {
            navigate('/expedientes');
            return;
        }

        const now = new Date();
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
        // 1. Definición de campos obligatorios para Consulta
        const camposObligatorios = [
            { id: 'motivo', label: 'Motivo de consulta' },
            { id: 'sintomas', label: 'Síntomas' },
            { id: 'tiempo_enfermedad', label: 'Tiempo de evolución' }
        ];

        // 2. Filtrar faltantes
        const faltantes = camposObligatorios.filter(campo => !formData[campo.id as keyof FormData]?.toString().trim());

        if (faltantes.length > 0) {
            const listaFaltantes = faltantes.map(f => `• ${f.label}`).join('\n');
            mostrarMensaje('error', `Los siguientes campos son obligatorios:\n${listaFaltantes}`);
            return;
        }

        setLoading(true)
        try {
            const consultaData = {
                ...formData,
                frecuencia_cardiaca: parseInt(formData.frecuencia_cardiaca) || undefined,
                frecuencia_respiratoria: parseInt(formData.frecuencia_respiratoria) || undefined,
                temperatura: parseFloat(formData.temperatura) || undefined,
                peso: parseFloat(formData.peso) || undefined,
                talla: parseFloat(formData.talla) || undefined,
                presion: formData.presion_arterial 
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
                <h1 style={{ margin: 0 }}>Nueva consulta</h1>
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
                        <div className="label-container">
                            <label>Motivo de consulta</label>
                            <span className={`contador ${(formData.motivo || '').length === 299 ? 'limite-alcanzado' : ''}`}>
                                {(formData.motivo || '').length}/299
                            </span>
                        </div>
                        <textarea name="motivo" maxLength={299} placeholder='Ingrese el motivo de la consulta...' rows={2} value={formData.motivo} onChange={handleInputChange} />
                    </div>
                    <div className="campo-form">
                        <div className="label-container">
                            <label>Síntomas</label>
                            <span className={`contador ${(formData.sintomas || '').length === 299 ? 'limite-alcanzado' : ''}`}>
                                {(formData.sintomas || '').length}/299
                            </span>
                        </div>
                        <textarea name="sintomas" maxLength={299} placeholder='Ingrese los sintomas del paciente...' rows={2} value={formData.sintomas} onChange={handleInputChange} />
                    </div>
                </div>

                <div className="campo-form">
                    <div className="label-container">
                        <label>Tiempo de evolución</label>
                        <span className={`contador ${(formData.tiempo_enfermedad || '').length === 15 ? 'limite-alcanzado' : ''}`}>
                            {(formData.tiempo_enfermedad || '').length}/15
                        </span>
                    </div>
                    <input type="text" name="tiempo_enfermedad" maxLength={15} placeholder='¿Desde cuando? Ej. 7 días' value={formData.tiempo_enfermedad} onChange={handleInputChange} />
                </div>

                <hr className="divisor-detalle" />

                <div className="fila-form">
                    <div className="campo-form">
                        <div className="label-container">
                            <label>Presión Arterial</label>
                            <span className={`contador ${(formData.presion_arterial || '').length === 10 ? 'limite-alcanzado' : ''}`}>
                                {(formData.presion_arterial || '').length}/10
                            </span>
                        </div>
                        <input type="text" name="presion_arterial" maxLength={10} placeholder="Ej. 120/80" value={formData.presion_arterial} onChange={handleInputChange} />
                    </div>
                    <div className="campo-form">
                        <div className="label-container">
                            <label>Frec. Cardiaca</label>
                            <span className={`contador ${(formData.frecuencia_cardiaca || '').length === 5 ? 'limite-alcanzado' : ''}`}>
                                {(formData.frecuencia_cardiaca || '').length}/5
                            </span>
                        </div>
                        <input type="text" inputMode="numeric" name="frecuencia_cardiaca" maxLength={5} placeholder="Ej. 75" value={formData.frecuencia_cardiaca} onChange={handleInputChange} />
                    </div>
                    <div className="campo-form">
                        <div className="label-container">
                            <label>Frec. Respiratoria</label>
                            <span className={`contador ${(formData.frecuencia_respiratoria || '').length === 5 ? 'limite-alcanzado' : ''}`}>
                                {(formData.frecuencia_respiratoria || '').length}/5
                            </span>
                        </div>
                        <input type="text" inputMode="numeric" name="frecuencia_respiratoria" maxLength={5} placeholder="Ej. 15" value={formData.frecuencia_respiratoria} onChange={handleInputChange} />
                    </div>
                </div>

                <div className="fila-form">
                    <div className="campo-form">
                        <div className="label-container">
                            <label>Temp (°C)</label>
                            <span className={`contador ${(formData.temperatura || '').length === 5 ? 'limite-alcanzado' : ''}`}>
                                {(formData.temperatura || '').length}/5
                            </span>
                        </div>
                        <input type="text" inputMode="decimal" name="temperatura" maxLength={5} placeholder="Ej. 36.5" value={formData.temperatura} onChange={handleInputChange} />
                    </div>
                    <div className="campo-form">
                        <div className="label-container">
                            <label>Peso (kg)</label>
                            <span className={`contador ${(formData.peso || '').length === 5 ? 'limite-alcanzado' : ''}`}>
                                {(formData.peso || '').length}/5
                            </span>
                        </div>
                        <input type="text" inputMode="decimal" name="peso" maxLength={5} placeholder="Ej. 75.5" value={formData.peso} onChange={handleInputChange} />
                    </div>
                    <div className="campo-form">
                        <div className="label-container">
                            <label>Talla (cm)</label>
                            <span className={`contador ${(formData.talla || '').length === 3 ? 'limite-alcanzado' : ''}`}>
                                {(formData.talla || '').length}/3
                            </span>
                        </div>
                        <input type="text" inputMode="decimal" name="talla" maxLength={3} placeholder="Ej. 180" value={formData.talla} onChange={handleInputChange} />
                    </div>
                </div>

                <hr className="divisor-detalle" />
                
                <div className="fila-form">
                    <div className="campo-form">
                        <div className="label-container">
                            <label>Diagnóstico</label>
                            <span className={`contador ${(formData.diagnostico || '').length === 299 ? 'limite-alcanzado' : ''}`}>
                                {(formData.diagnostico || '').length}/299
                            </span>
                        </div>
                        <textarea name="diagnostico" maxLength={299} rows={2} placeholder="Ingrese el diagnostico final de la consulta..." value={formData.diagnostico} onChange={handleInputChange} />
                    </div>

                    <div className="campo-form">
                        <div className="label-container">
                            <label>Medicamentos</label>
                            <span className={`contador ${(formData.medicamentos_recetados || '').length === 299 ? 'limite-alcanzado' : ''}`}>
                                {(formData.medicamentos_recetados || '').length}/299
                            </span>
                        </div>
                        <textarea name="medicamentos_recetados" maxLength={299} placeholder="Medicamentos, cantidad y frecuencia..." rows={2} value={formData.medicamentos_recetados} onChange={handleInputChange} />
                    </div>
                </div>

                <div className="campo-form">
                    <div className="label-container">
                        <label>Observaciones</label>
                        <span className={`contador ${(formData.observaciones || '').length === 299 ? 'limite-alcanzado' : ''}`}>
                            {(formData.observaciones || '').length}/299
                        </span>
                    </div>
                    <textarea name="observaciones" maxLength={299} placeholder="¿Alguna observación adicional?" rows={1} value={formData.observaciones} onChange={handleInputChange} />
                </div>

                {mensaje && (
                    <div className={`mensaje-error-flotante_PR ${tipoMensaje}`} style={{ whiteSpace: 'pre-line' }}>
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