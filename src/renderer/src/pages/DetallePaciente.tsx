import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { User, ChevronLeft, ClipboardList, Edit, Save, AlertCircle, CheckCircle, X, Stethoscope } from 'lucide-react';
import { EditarPaciente } from '../services/pacienteservice';
import type { Paciente } from '../types/Paciente';
import '../styles/DetallePaciente.css';
import '../styles/pacientesReg.css'; 

export default function DetallePaciente() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as { paciente: Paciente } | null;
  const initialPaciente = state?.paciente ?? null;

  const [pacienteState, setPacienteState] = useState<Paciente | null>(initialPaciente);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [tipoMensaje, setTipoMensaje] = useState<'error' | 'exito' | null>(null);

  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formData, setFormData] = useState<Paciente>(initialPaciente as Paciente);
  
  const [showEnfermedades, setShowEnfermedades] = useState(false);
  const [showAlergias, setShowAlergias] = useState(false);
  const [showCirugias, setShowCirugias] = useState(false);
  const [showMedicamentos, setShowMedicamentos] = useState(false);

  useEffect(() => {
    if (editando) {
      setShowEnfermedades(!!formData.enfermedades && formData.enfermedades !== 'Ninguna' && formData.enfermedades !== '');
      setShowAlergias(!!formData.alergias && formData.alergias !== 'Ninguna' && formData.alergias !== '');
      setShowCirugias(!!formData.cirugias_previas && formData.cirugias_previas !== 'Ninguna' && formData.cirugias_previas !== '');
      setShowMedicamentos(!!formData.medicamentos_actuales && formData.medicamentos_actuales !== 'Ninguna' && formData.medicamentos_actuales !== '');
    }
  }, [editando]);

  if (!pacienteState) {
    return (
      <div className="centro-total">
        <p>No se encontraron datos del paciente.</p>
        <button onClick={() => navigate('/expedientes')}>Volver</button>
      </div>
    );
  }

  const mostrarMensaje = (tipo: 'error' | 'exito', texto: string) => {
    setTipoMensaje(tipo);
    setMensaje(texto);
    setTimeout(() => { setMensaje(null); setTipoMensaje(null); }, 5000);
  };

  const fechaParaInput = (fecha: string) => {
    if (!fecha) return '';
    return new Date(fecha).toISOString().split('T')[0];
  };

  const guardarCambios = async () => {
    if (!pacienteState?.id) return;

    // --- LÓGICA DE VALIDACIÓN IGUAL A REGISTRO ---
    const camposObligatorios = [
        { id: 'nombre', label: 'Nombre completo' },
        { id: 'numero_afiliacion', label: 'Número de afiliación' },
        { id: 'fecha_nacimiento', label: 'Fecha de nacimiento' },
        { id: 'sexo', label: 'Sexo' },
        { id: 'tipo_sangre', label: 'Tipo de sangre' },
        { id: 'direccion', label: 'Dirección' },
        { id: 'celular', label: 'Celular' }
    ];

    const faltantes = camposObligatorios.filter(c => !String((formData as any)[c.id]).trim());

    if (faltantes.length > 0) {
        const lista = faltantes.map(f => `• ${f.label}`).join('\n');
        mostrarMensaje('error', `Los siguientes campos son obligatorios:\n${lista}`);
        return;
    }

    const dataToSave = { ...formData };
    if (!showEnfermedades) dataToSave.enfermedades = '';
    if (!showAlergias) dataToSave.alergias = '';
    if (!showCirugias) dataToSave.cirugias_previas = '';
    if (!showMedicamentos) dataToSave.medicamentos_actuales = '';

    try {
      setGuardando(true);
      await EditarPaciente(pacienteState.id, dataToSave);
      setPacienteState(dataToSave);
      setEditando(false);
      mostrarMensaje('exito', 'El Paciente se ha actualizado correctamente');
      window.dispatchEvent(new CustomEvent('pacienteActualizado', { detail: dataToSave }));
    } catch (error: any) {
      mostrarMensaje('error', 'Error al guardar cambios');
    } finally {
      setGuardando(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    if (!fecha) return 'N/A';
    const partes = fecha.split('-');
    return partes.length !== 3 ? fecha : `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  const calcularEdad = (fecha: string) => {
    if (!fecha) return 'N/A';
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
  };

  const renderDato = (valor: string) => {
    if (!valor || valor.trim() === "" || valor.toLowerCase() === "ninguna") {
      return <strong className="no-aplica">No aplica</strong>;
    }
    return <strong>{valor}</strong>;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const renderModoEdicion = () => (
    <div className="detalle-contenido modo-edicion-style">
      <p>Los datos del paciente se llenan automáticamente a menos que el dato haya estado previamente vacío. Los datos con un <strong>*</strong> son obligatorios para completar la acción.</p>
       <header className="">
          <div className="fila-form">
             <div className="campo-form">
                <div className="label-container">
                    <label>Nombre completo *</label>
                    <span className={`contador ${(formData.nombre || '').length === 60 ? 'limite-alcanzado' : ''}`}>
                        {(formData.nombre || '').length}/60
                    </span>
                </div>
                <input 
                  type="text" name="nombre" value={formData.nombre} onChange={handleChange} maxLength={60}  placeholder="Ingrese el nombre del paciente..." 
                />
             </div>
             <div className="campo-form">
                <div className="label-container">
                    <label>Afiliación *</label>
                    <span className={`contador ${(formData.numero_afiliacion || '').length === 8 ? 'limite-alcanzado' : ''}`}>
                        {(formData.numero_afiliacion || '').length}/8
                    </span>
                </div>
                <input 
                  type="text" name="numero_afiliacion" value={formData.numero_afiliacion} onChange={handleChange} maxLength={8} placeholder="Ingrese el número de afiliación..." 
                />
             </div>
          </div>
        </header>

        <hr className="divisor-detalle" />

        <div className="campo-form">
            <label>Fecha de nacimiento *</label>
            <input
                type="date"
                name='fecha_nacimiento'
                value={fechaParaInput(formData.fecha_nacimiento)}
                onChange={handleChange}
            />
        </div>

        <div className="fila-form">
            <div className="campo-form">
                <label>Sexo *</label>
                <select name="sexo" value={formData.sexo} onChange={handleChange}>
                    <option value="" disabled>Seleccionar</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                </select>
            </div>
            <div className="campo-form">
                <label>Tipo de sangre *</label>
                <select name="tipo_sangre" value={formData.tipo_sangre} onChange={handleChange}>
                    <option value="" disabled>Seleccionar</option>
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
                <label>¿Recibe donaciones? *</label>
                <select 
                    name="recibe_donaciones" 
                    value={formData.recibe_donaciones ? 'si' : 'no'}
                    onChange={(e) => setFormData(prev => ({...prev, recibe_donaciones: e.target.value === 'si'}))} 
                >
                    <option value="no">No</option>
                    <option value="si">Sí</option>
                </select>
            </div>
        </div>

        <hr className="divisor-detalle" />

        <div className="campo-form">
            <div className="label-container">
                <label>Dirección *</label>
                <span className={`contador ${(formData.direccion || '').length === 120 ? 'limite-alcanzado' : ''}`}>
                    {(formData.direccion || '').length}/120
                </span>
            </div>
            <input 
                type="text" name='direccion' maxLength={120} value={formData.direccion} onChange={handleChange} placeholder="Ingrese la dirección completa..." 
            />
        </div>

        <div className="fila-form">
            <div className="campo-form">
                <div className="label-container">
                    <label>Celular *</label>
                    <span className={`contador ${(formData.celular || '').length === 15 ? 'limite-alcanzado' : ''}`}>
                        {(formData.celular || '').length}/15
                    </span>
                </div>
                <input type="tel" name='celular' maxLength={15} value={formData.celular} onChange={handleChange} placeholder="Ingrese el número de celular..." /> 
            </div>
            <div className="campo-form">
                <div className="label-container">
                    <label>Contacto de emergencia</label>
                    <span className={`contador ${(formData.contacto_emergencia || '').length === 15 ? 'limite-alcanzado' : ''}`}>
                        {(formData.contacto_emergencia || '').length}/15
                    </span>
                </div>
                <input type="text" name='contacto_emergencia' maxLength={15} value={formData.contacto_emergencia} onChange={handleChange} placeholder="Ingrese el contacto de emergencia..." />
            </div>
        </div>

        <hr className="divisor-detalle" />

        {[
            { label: '¿Enfermedades?', state: showEnfermedades, setter: setShowEnfermedades, name: 'enfermedades', max: 299 },
            { label: '¿Alergias?', state: showAlergias, setter: setShowAlergias, name: 'alergias', max: 299 },
            { label: '¿Cirugías previas?', state: showCirugias, setter: setShowCirugias, name: 'cirugias_previas', max: 299 },
            { label: '¿Medicamentos actuales?', state: showMedicamentos, setter: setShowMedicamentos, name: 'medicamentos_actuales', max: 299 }
        ].map((item) => (
            <div className="campo-form" key={item.name}>
                <label>{item.label}</label>
                <div className="radio-group">
                    <label><input type="radio" checked={!item.state} onChange={() => item.setter(false)} /> No</label>
                    <label><input type="radio" checked={item.state} onChange={() => item.setter(true)} /> Sí</label>
                </div>
                {item.state && (
                    <>
                        <div className="label-container">
                            <label className='detalles'>Detalles de {item.label.replace(/[¿?]/g, '').toLowerCase()}</label>
                            <span className={`contador ${((formData as any)[item.name] || '').length === item.max ? 'limite-alcanzado' : ''}`}>
                                {((formData as any)[item.name] || '').length}/{item.max}
                            </span>
                        </div>
                        <textarea 
                            name={item.name} maxLength={item.max} rows={3} 
                            value={(formData as any)[item.name] || ''} onChange={handleChange} 
                            placeholder="Especifique los detalles..." 
                        />
                    </>
                )}
            </div>
        ))}
    </div>
  );

  const renderModoLectura = () => (
    <div className="detalle-contenido">
        <header className="perfil-info">
          <div className="avatar-circle">
            <User size={40} />
          </div>
          <div className="nombre-afiliacion">
             <h2>{pacienteState.nombre}</h2>
             <p>Afiliación: {pacienteState.numero_afiliacion}</p>
          </div>
        </header>

        <hr className="divisor-detalle" />

        <div className="bloque-datos">
          <div className="dato-columna">
            <span>Fecha de nacimiento</span>
            <strong>{formatearFecha(pacienteState.fecha_nacimiento)}</strong>
          </div>
          <div className="dato-columna">
            <span>Edad</span>
            <strong>{calcularEdad(pacienteState.fecha_nacimiento)} años</strong>
          </div>
          <div className="dato-columna">
            <span>Sexo</span>
            <strong>{pacienteState.sexo}</strong>
          </div>
          <div className="dato-columna">
             <span>Contacto</span>
             <strong>{pacienteState.celular}</strong>
          </div>
          <div className="dato-columna">
            <span>Emergencia</span>
            {renderDato(pacienteState.contacto_emergencia)}
          </div>
          <div className="dato-columna ancho-completo">
            <span>Dirección</span>
            {renderDato(pacienteState.direccion)}
          </div>
        </div>

        <hr className="divisor-detalle" />

        <div className="bloque-datos">
           <div className="dato-columna">
              <span>Tipo de Sangre</span>
              <strong>{pacienteState.tipo_sangre}</strong>
           </div>
           <div className="dato-columna">
              <span>¿Recibe donaciones?</span>
              <strong>{pacienteState.recibe_donaciones ? 'Sí' : 'No'}</strong>
           </div>
        </div>

        <hr className="divisor-detalle" />

        <div className="bloque-datos">
           <div className="dato-columna">
             <span>Alergias</span>
             {renderDato(pacienteState.alergias)}
           </div>
           <div className="dato-columna">
             <span>Enfermedades</span>
             {renderDato(pacienteState.enfermedades)}
           </div>
           <div className="dato-columna">
             <span>Cirugías previas</span>
             {renderDato(pacienteState.cirugias_previas)}
           </div>
           <div className="dato-columna">
             <span>Medicación actual</span>
             {renderDato(pacienteState.medicamentos_actuales)}
           </div>
        </div>
    </div>
  );

  return (
    <div className="contenedor-espera">
      
      <div className="header">
        <button className="btn-volver-minimal" onClick={() => navigate(-1)}>
          <ChevronLeft className='btn-volver-minimal-icon'/>
        </button>
        <h1>{editando ? 'Editar expediente' : 'Expediente del paciente'}</h1>
      </div>

      {editando ? renderModoEdicion() : renderModoLectura()}

      <div className="contenedor-botones-flotantes">
        {mensaje && (
          <div className={`mensaje-error-flotante_PR ${tipoMensaje}`} style={{ whiteSpace: 'pre-line' }}>
            {tipoMensaje === 'error' ? (
              <AlertCircle size={20} />
            ) : (
              <CheckCircle size={20} />
            )}
            <span>{mensaje}</span>
          </div>
        )}

        {!editando && (
          <>
                      <button className="btn-flotante-añadir" onClick={() => {
                setFormData(pacienteState);
                setEditando(true);
            }}>
              <Edit size={24} /> Editar expediente
            </button>
            <button 
              className="btn-flotante-añadir btn-historial"
              onClick={() => navigate(`/historial/${pacienteState.id}`, { state: { paciente: pacienteState } })}
            >
              <ClipboardList size={24} />
              <span>Historial de consultas</span>
            </button>

            <button
              className="btn-flotante-añadir"
              onClick={(e) => {
                e.stopPropagation();
                if (!pacienteState) return;
                navigate("/consultas", {
                  state: {
                    id: pacienteState.id,
                    nombre: pacienteState.nombre,
                    numero_afiliacion: pacienteState.numero_afiliacion,
                    pacienteRegistrado: true
                  }
                });
              }}
            >
              <Stethoscope size={24} />
              <span>Nueva consulta</span>
            </button>


          </>
        )}

        {editando && (
          <>
                      <button
              className="btn-flotante-añadir"
              onClick={() => {
                setFormData(pacienteState);
                setEditando(false);
              }}
            >
              <X size={24} />
            </button>

            <button className="btn-flotante-añadir" onClick={guardarCambios} disabled={guardando}>
              <Save size={24} /> {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>


          </>
        )}
      </div>
    </div>
  );
}