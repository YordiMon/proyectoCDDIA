import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeft, User, Save, AlertCircle, FilePlus } from 'lucide-react'
import '../styles/pacientesReg.css'
import { crearPaciente, Paciente } from '../services/pacienteservice'

export default function RegistroPacientes() {
    const location = useLocation()
    const navigate = useNavigate()
    const state = (location.state ?? {}) as { id?:  number;  idEspera: number; nombre?: string; numero_afiliacion?: string }
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [mensaje, setMensaje] = useState<string | null>(null);

    const [enfermedades, setEnfermedades] = useState(false)
    const [alergias, setAlergias] = useState(false)
    const [cirugias, setCirugias] = useState(false)
    const [medicamentos, setMedicamentos] = useState(false)

    const [paciente, setPaciente] = useState<Paciente>({
        nombre: state.nombre ?? '',
        numero_afiliacion: state.numero_afiliacion ?? '',
        fecha_nacimiento: '',
        sexo: '',
        tipo_sangre: '',
        recibe_donaciones: false,
        direccion: '',
        celular: '',
        contacto_emergencia: '',
        enfermedades: '',
        alergias: '',
        cirugias_previas: '',
        medicamentos_actuales: ''
    })

       // Función para mostrar el error por unos segundos y luego ocultarlo
  const mostrarError = (mensaje: string) => {
    setErrorMessage(mensaje);
    setTimeout(() => setErrorMessage(null), 3000);
  };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setPaciente(prev => ({ ...prev, [name]: value }))
    }

    const guardar = async (irAConsultas = false) => {
        try {
            const resultado = await crearPaciente(paciente)
            mostrarError('Paciente registrado correctamente');
            if (irAConsultas) {
                navigate('/consultas', {
                    state: { id: resultado.id,   nombre: paciente.nombre, numero_afiliacion: paciente.numero_afiliacion }
                });
            } else {
                navigate('/expedientes');
            }
        } catch (error: any) {
            mostrarError('Error al registrar: ' + JSON.stringify(error));
        }
    };

    return (
        <div className="contenedor-espera">
            <header className='header'>
                <button onClick={() => navigate('/expedientes')} className="btn-volver-minimal" type="button">
                    <ChevronLeft size={32} strokeWidth={2.5} />
                </button>
                <h1>Registrar paciente</h1>
            </header>

            <section>
                <header className="perfil-info">
                    <div className="avatar-circle"><User size={40} /></div>
                    <div className="nombre-afiliacion">
                        <h2>{paciente.nombre}</h2>
                        <p>Afiliación: {paciente.numero_afiliacion}</p>
                    </div>
                </header>

                <hr className="divisor-detalle" />

                <div className="campo-form">
                    <label>Fecha de nacimiento</label>
                    <input
                        type="date"
                        name='fecha_nacimiento'
                        className={paciente.fecha_nacimiento ? 'valor-real' : 'placeholder-style'}
                        value={paciente.fecha_nacimiento}
                        onChange={handleChange}
                    />
                </div>

                <div className="fila-form">
                    <div className="campo-form">
                        <label>Sexo</label>
                      <select
                                name="sexo"
                                value={paciente.sexo}
                                onChange={handleChange}
                                className={paciente.sexo === "" ? 'placeholder-style' : 'valor-real'}
                                >
                                <option value="" disabled hidden>
                                    Seleccionar
                                </option>
                                <option value="masculino">Masculino</option>
                                <option value="femenino">Femenino</option>
                                </select>

                    </div>

                    <div className="campo-form">
                        <label>Tipo de sangre</label>
                        <select
                           name="tipo_sangre"
                           value={paciente.tipo_sangre}     
                           onChange={handleChange}     
                           className={paciente.tipo_sangre === "" ? 'placeholder-style' : 'valor-real'}
                        >
                            <option value="" disabled hidden>
                                Seleccionar
                            </option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>     
                        </select>

                    </div>

                    <div className="campo-form">
                        <label>Donaciones</label>
                        <select name="recibe_donaciones" onChange={(e) => setPaciente(p => ({...p, recibe_donaciones: e.target.value === 'si'}))} className="valor-real">
                            <option value="no">No</option>
                            <option value="si">Sí</option>
                        </select>
                    </div>
                </div>

                <hr className="divisor-detalle" />

                <div className="campo-form">
                    <label>Dirección</label>
                    <input type="text" name='direccion' placeholder="Dirección completa..." value={paciente.direccion} onChange={handleChange} />
                </div>

                <div className="fila-form">
                    <div className="campo-form">
                        <label>Celular</label>
                        <input type="tel" name='celular' placeholder="Celular" value={paciente.celular} onChange={handleChange} />
                    </div>
                    <div className="campo-form">
                        <label>Contacto de emergencia</label>
                        <input type="text" name='contacto_emergencia' placeholder="Emergencia" value={paciente.contacto_emergencia} onChange={handleChange} />
                    </div>
                </div>

                <hr className="divisor-detalle" />

                {/* Secciones de Antecedentes */}
                {[
                    { label: '¿Enfermedades?', state: enfermedades, setter: setEnfermedades, name: 'enfermedades' },
                    { label: '¿Alergias?', state: alergias, setter: setAlergias, name: 'alergias' },
                    { label: '¿Cirugías previas?', state: cirugias, setter: setCirugias, name: 'cirugias_previas' },
                    { label: '¿Medicamentos actuales?', state: medicamentos, setter: setMedicamentos, name: 'medicamentos_actuales' }
                ].map((item) => (
                    <div className="campo-form" key={item.name}>
                        <label>{item.label}</label>
                        <div className="radio-group">
                            <label><input type="radio" checked={!item.state} onChange={() => item.setter(false)} /> No</label>
                            <label><input type="radio" checked={item.state} onChange={() => item.setter(true)} /> Sí</label>
                        </div>
                        {item.state && <textarea name={item.name} placeholder="Especifique..." rows={3} value={(paciente as any)[item.name]} onChange={handleChange} />}
                    </div>
                ))}
                {/* Mensaje de error unificado y dinámico */}
                    {errorMessage && (
                    <div className="mensaje-error-flotante_PR">
                        <AlertCircle size={18} />
                        <span>{errorMessage}</span>
                    </div>
                )}
                {/* BOTONES FLOTANTES */}
                <div className="contenedor-botones-flotantes">
                    <button type="button" className="btn-flotante-añadir" onClick={() => guardar(false)}>
                        <Save size={24} />
                        Guardar paciente
                    </button>
                    <button type="button" className="btn-flotante-añadir" onClick={() => guardar(true)}>
                        <FilePlus size={24} />
                        Guardar e ir a consulta
                    </button>
                </div>
            </section>
        </div>
    )
}