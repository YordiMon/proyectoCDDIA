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
        recibe_donaciones: false, // Por defecto false, pero validaremos si se tocó el select
        direccion: '',
        celular: '',
        contacto_emergencia: '',
        enfermedades: '',
        alergias: '',
        cirugias_previas: '',
        medicamentos_actuales: ''
    })

    // Estado adicional para validar si el usuario seleccionó una opción en donaciones
    const [donacionSeleccionada, setDonacionSeleccionada] = useState(false);

    const mostrarError = (mensaje: string) => {
        setErrorMessage(mensaje);
        // Aumentamos un poco el tiempo a 5s porque la lista es más larga de leer
        setTimeout(() => setErrorMessage(null), 5000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setPaciente(prev => ({ ...prev, [name]: value }))
    }

    const guardar = async (irAConsultas = false) => {
        // 1. Definición de campos obligatorios
        const campos = [
            { id: 'nombre', label: 'Nombre completo' },
            { id: 'numero_afiliacion', label: 'Número de afiliación' },
            { id: 'fecha_nacimiento', label: 'Fecha de nacimiento' },
            { id: 'sexo', label: 'Sexo' },
            { id: 'celular', label: 'Celular' },
            { id: 'direccion', label: 'Dirección' },
            { id: 'tipo_sangre', label: 'Tipo de sangre' }
        ];

        // 2. Verificar faltantes
        const faltantes = campos.filter(c => !String((paciente as any)[c.id]).trim());
        
        // Validación manual para el booleano de donaciones (opcional si quieres forzar elección)
        if (!donacionSeleccionada) {
            faltantes.push({ id: 'recibe_donaciones', label: '¿Recibe donaciones?' });
        }

        // 3. Mostrar mensaje si hay errores
        if (faltantes.length > 0) {
            const lista = faltantes.map(f => `• ${f.label}`).join('\n');
            mostrarError(`Los siguientes campos son obligatorios:\n${lista}`);
            return;
        }

        try {
            const resultado = await crearPaciente(paciente)
            if (irAConsultas) {
                navigate('/consultas', {
                    state: { id: resultado.id,   nombre: paciente.nombre, numero_afiliacion: paciente.numero_afiliacion }
                });
            } else {
                navigate('/expedientes');
            }
        } catch (error: any) {
            mostrarError('Error al registrar: ' + (error.message || 'Error en el servidor'));
        }
    };

    const mostrarInputsPrincipales = !state.nombre || !state.numero_afiliacion;

    return (
        <div className="contenedor-espera">
            <header className='header'>
                <button onClick={() => navigate('/expedientes')} className="btn-volver-minimal" type="button">
                    <ChevronLeft size={32} strokeWidth={2.5} />
                </button>
                <h1>Registrar paciente</h1>
            </header>

            <section>
                {mostrarInputsPrincipales ? (
                    <div className="fila-form" style={{ marginTop: '10px' }}>
                        <div className="campo-form">
                            <div className="label-container">
                                <label>Nombre completo</label>
                                <span className={`contador ${(paciente.nombre || '').length === 60 ? 'limite-alcanzado' : ''}`}>
                                    {(paciente.nombre || '').length}/60
                                </span>
                            </div>
                            <input 
                                type="text" 
                                name="nombre" 
                                maxLength={60}
                                placeholder="Ingrese el nombre del paciente..." 
                                value={paciente.nombre} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div className="campo-form">
                            <div className="label-container">
                                <label>Número de afiliación</label>
                                <span className={`contador ${(paciente.numero_afiliacion || '').length === 8 ? 'limite-alcanzado' : ''}`}>
                                    {(paciente.numero_afiliacion || '').length}/8
                                </span>
                            </div>
                            <input 
                                type="text" 
                                name="numero_afiliacion" 
                                maxLength={8}
                                placeholder="Ingrese el número de afiliación..." 
                                value={paciente.numero_afiliacion} 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>
                ) : (
                    <header className="perfil-info">
                        <div className="avatar-circle">
                            <User size={40} />
                        </div>
                        <div className="nombre-afiliacion">
                            <h2>{paciente.nombre}</h2>
                            <p>Afiliación: {paciente.numero_afiliacion}</p>
                        </div>
                    </header>
                )}

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
                            <option value="" disabled hidden>Seleccionar</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
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
                        <label>¿Recibe donaciones?</label>
                        <select 
                            name="recibe_donaciones" 
                            value={!donacionSeleccionada ? "" : (paciente.recibe_donaciones ? 'si' : 'no')}
                            onChange={(e) => {
                                setDonacionSeleccionada(true);
                                setPaciente(p => ({...p, recibe_donaciones: e.target.value === 'si'}));
                            }} 
                            className={!donacionSeleccionada ? 'placeholder-style' : 'valor-real'}
                        >
                            <option value="" disabled hidden>Seleccionar</option>
                            <option value="no">No</option>
                            <option value="si">Sí</option>
                        </select>
                    </div>
                </div>

                <hr className="divisor-detalle" />

                <div className="campo-form">
                    <div className="label-container">
                        <label>Dirección</label>
                        <span className={`contador ${(paciente.direccion || '').length === 120 ? 'limite-alcanzado' : ''}`}>
                            {(paciente.direccion || '').length}/120
                        </span>
                    </div>
                    <input 
                        type="text" 
                        name='direccion' 
                        maxLength={120}
                        placeholder="Ingrese la dirección completa..." 
                        value={paciente.direccion} 
                        onChange={handleChange} 
                    />
                </div>

                <div className="fila-form">
                    <div className="campo-form">
                        <div className="label-container">
                            <label>Celular</label>
                            <span className={`contador ${(paciente.celular || '').length === 15 ? 'limite-alcanzado' : ''}`}>
                                {(paciente.celular || '').length}/15
                            </span>
                        </div>
                        <input 
                            type="tel" 
                            name='celular' 
                            maxLength={15}
                            placeholder="Ingrese el número de celular..." 
                            value={paciente.celular} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="campo-form">
                        <div className="label-container">
                            <label>Contacto de emergencia</label>
                            <span className={`contador ${(paciente.contacto_emergencia || '').length === 15 ? 'limite-alcanzado' : ''}`}>
                                {(paciente.contacto_emergencia || '').length}/15
                            </span>
                        </div>
                        <input 
                            type="text" 
                            name='contacto_emergencia' 
                            maxLength={15}
                            placeholder="Ingrese el contacto de emergencia..." 
                            value={paciente.contacto_emergencia} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>

                <hr className="divisor-detalle" />

                {[
                    { label: '¿Enfermedades?', state: enfermedades, setter: setEnfermedades, name: 'enfermedades', max: 299 },
                    { label: '¿Alergias?', state: alergias, setter: setAlergias, name: 'alergias', max: 299 },
                    { label: '¿Cirugías previas?', state: cirugias, setter: setCirugias, name: 'cirugias_previas', max: 299 },
                    { label: '¿Medicamentos actuales?', state: medicamentos, setter: setMedicamentos, name: 'medicamentos_actuales', max: 299 }
                ].map((item) => (
                    <div className="campo-form" key={item.name}>
                        <label>{item.label}</label>
                        <div className="radio-group">
                            <label><input type="radio" checked={!item.state} onChange={() => item.setter(false)} /> No</label>
                            <label><input type="radio" checked={item.state} onChange={() => item.setter(true)} /> Sí</label>
                        </div>
                        {item.state && (
                            <>
                                <div className="label-container" style={{ marginTop: '10px' }}>
                                    <label style={{ fontSize: '0.85rem', color: '#666' }}>Detalles de {item.label.replace(/[¿?]/g, '').toLowerCase()}</label>
                                    <span className={`contador ${((paciente as any)[item.name] || '').length === item.max ? 'limite-alcanzado' : ''}`}>
                                        {((paciente as any)[item.name] || '').length}/{item.max}
                                    </span>
                                </div>
                                <textarea 
                                    name={item.name} 
                                    maxLength={item.max}
                                    placeholder="Especifique los detalles..." 
                                    rows={3} 
                                    value={(paciente as any)[item.name] || ''} 
                                    onChange={handleChange} 
                                />
                            </>
                        )}
                    </div>
                ))}

                {errorMessage && (
                    <div className="mensaje-error-flotante_PR">
                        <AlertCircle size={18} />
                        <span>{errorMessage}</span>
                    </div>
                )}

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