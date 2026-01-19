import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import '../styles/pacientesReg.css'
import { crearPaciente, Paciente } from '../services/pacienteService'


export default function RegistroPacientes() {

    const location = useLocation()
    const navigate = useNavigate()
    const state = (location.state ?? {}) as { nombre?: string; numero_afiliacion?: string }
    const [enfermedades, setEnfermedades] = useState(false)
    const [alergias, setAlergias] = useState(false)
    const [cirugias, setCirugias] = useState(false)
       
    // Estado para el formulario de paciente
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



// Manejar cambios en los campos del formulario
 const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value } = e.target

  setPaciente({
    ...paciente,
    [name]: value
  })
}

// Manejar cambio específico para recibe_donaciones
const handleDonaciones = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setPaciente({
    ...paciente,
    recibe_donaciones: e.target.value === 'si'
  })
}

// Guardar paciente
const guardar = async (irAConsultas = false) => {
  try {
    await crearPaciente(paciente);

    alert('Paciente registrado correctamente');

    if (irAConsultas) {
      navigate('/consultas', {
        state: {
          nombre: paciente.nombre,
          numero_afiliacion: paciente.numero_afiliacion
        }
      });
    } else {
      navigate('/expedientes');
    }

  } catch (error: any) {
    alert('Error al registrar paciente: ' + JSON.stringify(error));
  }
};






return (
      <div className="consulta-container">
       <header>
         <button
          onClick={() => navigate('/expedientes')}
          className="btn-volver-minimal"
          title="Volver a expedientes"
          type="button" >
          <ChevronLeft size={32} strokeWidth={2.5} />
      </button>
      
       <h1>Registro del paciente</h1>
      </header>

      <section>
       

        

        <h2>Datos personales</h2>
        <div className="field">
          <label>Nombre Completo</label>
          <input
            type="text" 
            name="nombre"
            value={paciente.nombre}
            onChange={handleChange}
          />        
        </div>

        <div className="field">
          <label>Número de afiliación</label>
          <input
            type="text"
            name="numero_afiliacion"
            value={paciente.numero_afiliacion}
            onChange={handleChange}
          />
        </div>  

        <div className="field">
          <label>Fecha de nacimiento</label>
          <input
            type="date"
            name="fecha_nacimiento"
            value={paciente.fecha_nacimiento}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Sexo</label>
          <select name="sexo" value={paciente.sexo} onChange={handleChange}>
            <option value="Seleccionar">Seleccionar</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
        </div>

        <div className="field">
          <label>Tipo de sangre</label>
          <select name="tipo_sangre" value={paciente.tipo_sangre} onChange={handleChange}>
            <option>Seleccionar</option>
            <option>A+</option><option>A-</option>
            <option>B+</option><option>B-</option>
            <option>AB+</option><option>AB-</option>
            <option>O+</option><option>O-</option>
          </select>
        </div>

        <div className="field">
          <label>Recibe donaciones</label>
          <select name="recibe_donaciones" onChange={handleDonaciones}>
            <option value="Seleccionar">Seleccionar</option>
            <option value="no">No</option>
            <option value="si">Sí</option>
            
          </select>
        </div>

        <div className="field">
          <label>Dirección</label>
          <input
            type="text"
            name="direccion"
            value={paciente.direccion}
            onChange={handleChange}
            />

        </div>

        <div className="field">
          <label>Celular</label>
          <input
            type="tel"
            name="celular"
            value={paciente.celular}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Contacto de emergencia</label>
        <input
          type="text"
          name="contacto_emergencia"
          value={paciente.contacto_emergencia}
          onChange={handleChange}
        />
        </div>

      

        <h4>Historial médico</h4>

        <div className="field">
          <label>¿Enfermedades?</label>
          <div className="radio-group">
            <label><input type="radio" checked={!enfermedades} onChange={() => setEnfermedades(false)} /> No</label>
            <label><input type="radio" checked={enfermedades} onChange={() => setEnfermedades(true)} /> Sí</label>
          </div>
          {enfermedades && (
            <textarea
              name="enfermedades"
              rows={4}
              value={paciente.enfermedades}
              onChange={handleChange}
            />
 
            )}
        </div>

        <div className="field">
          <label>¿Alergias?</label>
          <div className="radio-group">
            <label><input type="radio" checked={!alergias} onChange={() => setAlergias(false)} /> No</label>
            <label><input type="radio" checked={alergias} onChange={() => setAlergias(true)} /> Sí</label>
          </div>
          {alergias && ( <textarea name="alergias" rows={4} value={paciente.alergias} onChange={handleChange} /> )}
        </div>

        <div className="field">
          <label>¿Cirugías previas?</label>
          <div className="radio-group">
            <label><input type="radio" checked={!cirugias} onChange={() => setCirugias(false)} /> No</label>
            <label><input type="radio" checked={cirugias} onChange={() => setCirugias(true)} /> Sí</label>
          </div>
          {cirugias && ( <textarea name="cirugias_previas" rows={4} value={paciente.cirugias_previas} onChange={handleChange} /> )}
        </div>

        <div className="field">
        <label>Medicamentos actuales</label>
          <textarea name="medicamentos_actuales" rows={4} value={paciente.medicamentos_actuales} onChange={handleChange} />
        </div>
       

        <div className="btnguardar">
          
            <button className="btn-consulta btn-guardar" onClick={() => guardar(false)}>
              Guardar Paciente
            </button>

            <button className="btn-consulta btn-guardar" onClick={() => guardar(true)}>
              Guardar e ir a consulta
            </button>


          </div>



 </section>
        </div>
          )
}


