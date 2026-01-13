import { useEffect, useState } from 'react'
import '../CSS/consulta.css'

export default function Consultas() {
  const [fechaEvaluacion, setFechaEvaluacion] = useState('')

  const [enfermedades, setEnfermedades] = useState(false)
  const [alergias, setAlergias] = useState(false)
  const [cirugias, setCirugias] = useState(false)

  useEffect(() => {
    const now = new Date()
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

    const hermosillo = formatToTimeZone(now, 'America/Hermosillo')
    setFechaEvaluacion(hermosillo)
  }, [])

  return (

    <div className="consulta-container">
      <header>
        <h1>Consulta</h1>
      </header>

      <section>
        <h2>Detalles de la consulta</h2>

        <h4>Datos personales</h4>

        <div className="field">
          <label>Fecha de nacimiento</label>
          <input type="date" name="fecha" />
        </div>

        <div className="field">
          <label>Edad</label>
          <input type="number" name="edad" />
        </div>

        <div className="field">
          <label>Sexo</label>
          <select name="sexo">
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
        </div>

        <div className="field">
          <label>Tipo de sangre</label>
          <select name="tipoSangre">
            <option>A+</option><option>A-</option>
            <option>B+</option><option>B-</option>
            <option>AB+</option><option>AB-</option>
            <option>O+</option><option>O-</option>
          </select>
        </div>

        <div className="field">
          <label>Recibe donaciones</label>
          <select name="donaciones">
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="field">
          <label>Dirección</label>
          <input type="text" name="direccion" />
        </div>

        <div className="field">
          <label>Teléfono</label>
          <input type="tel" name="telefono" />
        </div>

        <div className="field">
          <label>Contacto de emergencia</label>
          <input type="text" name="contactoEmergencia" />
        </div>

        <div className="field">
          <label>Fecha de evaluación</label>
          <input type="datetime-local" name="fechaEvaluacion" value={fechaEvaluacion} readOnly />
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
          {cirugias && ( <textarea name="cirugias" rows={4} /> )}
        </div>

        <h4>Motivo de consulta</h4>
        <div className="field">
          <textarea name="motivoConsulta" rows={4} />
        </div>

        <h4>Exploración física</h4>
        <div className="field">
          <label>Presión arterial (mmHg)</label>
          <div className="radio-group">
            <input
              type="number"
              name="presionSistolica"
              placeholder="Sistólica"
              min={50}
              max={250}
            />
            <span>/</span>
            <input
              type="number"
              name="presionDiastolica"
              placeholder="Diastólica"
              min={30}
              max={150}
            />
          </div>
        </div>

        <div className="field">
          <label>Frecuencia cardiaca (lpm)</label>
          <input
            type="number"
            name="frecuenciaCardiaca"
            min={30}
            max={220}
            placeholder="Ej. 72"
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
          />
        </div>

        <div className="field">
          <label>Frecuencia respiratoria (rpm)</label>
          <input
            type="number"
            name="frecuenciaRespiratoria"
            min={5}
            max={60}
            placeholder="Ej. 18"
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
          />
        </div>


        <h4>Diagnóstico</h4>
        <div className="field"><textarea rows={4} /></div>

        <h4>Tratamiento</h4>
        <div className="field"><textarea rows={4} /></div>

        <h4>Medicamentos recetados</h4>
        <div className="field"><textarea rows={4} /></div>

        <h4>Observaciones</h4>
        <div className="field"><textarea rows={4} /></div>
      </section>
=======

    </div>
  )
}
