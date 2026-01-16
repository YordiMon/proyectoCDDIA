import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import '../CSS/pacientesReg.css'

export default function RegistoPacientes() {
  const location = useLocation()
  const state = (location.state ?? {}) as { nombre?: string; numero_afiliacion?: string }
    const [enfermedades, setEnfermedades] = useState(false)
    const [alergias, setAlergias] = useState(false)
    const [cirugias, setCirugias] = useState(false)
    




return (
      <div className="consulta-container">
      <header>
        <h1>Consulta</h1>
      </header>

      <section>
        <h1>Detalles de la consulta</h1>

        <h4>Datos personales</h4>
        <div className="field">
          <label>Nombre Completo</label>
          <input type="text" name="nombre" defaultValue={state.nombre ?? ''} />
        </div>
        <div className="field">
          <label>Número de afiliación</label>
          <input type="text" name="numero_afiliacion" defaultValue={state.numero_afiliacion ?? ''} />
        </div>  

        <div className="field">
          <label>Fecha de nacimiento</label>
          <input type="date" name="fecha_nacimiento" />
        </div>

        <div className="field">
          <label>Edad</label>
          <input type="number" name="edad" />
        </div>

        <div className="field">
          <label>Sexo</label>
          <select name="sexo">
            <option value="Seleccionar">Otro</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
        </div>

        <div className="field">
          <label>Tipo de sangre</label>
          <select name="tipo_sangre">
            <option>Seleccionar</option>
            <option>A+</option><option>A-</option>
            <option>B+</option><option>B-</option>
            <option>AB+</option><option>AB-</option>
            <option>O+</option><option>O-</option>
          </select>
        </div>

        <div className="field">
          <label>Recibe donaciones</label>
          <select name="recibe_donaciones">
            <option value="Seleccionar">Seleccionar</option>
            <option value="no">No</option>
            <option value="si">Sí</option>
            
          </select>
        </div>

        <div className="field">
          <label>Dirección</label>
          <input type="text" name="direccion" />
        </div>

        <div className="field">
          <label>Celular</label>
          <input type="tel" name="celular" />
        </div>

        <div className="field">
          <label>Contacto de emergencia</label>
          <input type="text" name="contacto_emergencia" />
        </div>

      

        <h4>Historial médico</h4>

        <div className="field">
          <label>¿Enfermedades?</label>
          <div className="radio-group">
            <label><input type="radio" checked={!enfermedades} onChange={() => setEnfermedades(false)} /> No</label>
            <label><input type="radio" checked={enfermedades} onChange={() => setEnfermedades(true)} /> Sí</label>
          </div>
          {enfermedades && (
            <textarea name="enfermedades" rows={4} /> 
            )}
        </div>

        <div className="field">
          <label>¿Alergias?</label>
          <div className="radio-group">
            <label><input type="radio" checked={!alergias} onChange={() => setAlergias(false)} /> No</label>
            <label><input type="radio" checked={alergias} onChange={() => setAlergias(true)} /> Sí</label>
          </div>
          {alergias && ( <textarea name="alergias" rows={4} /> )}
        </div>

        <div className="field">
          <label>¿Cirugías previas?</label>
          <div className="radio-group">
            <label><input type="radio" checked={!cirugias} onChange={() => setCirugias(false)} /> No</label>
            <label><input type="radio" checked={cirugias} onChange={() => setCirugias(true)} /> Sí</label>
          </div>
          {cirugias && ( <textarea name="cirugias_previas" rows={4} /> )}
        </div>

        <div className="field">
        <label>Medicamentos actuales</label>
          <textarea name="medicamentos_actuales" rows={4} />
        </div>
        </section>
        </div>





       )