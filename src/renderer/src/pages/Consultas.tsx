import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import '../CSS/consulta.css'

export default function Consultas() {
  const [fechaEvaluacion, setFechaEvaluacion] = useState('')
  const location = useLocation()
  const state = (location.state ?? {}) as { nombre?: string; numero_afiliacion?: string }

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
        <h1>Detalles de la consulta</h1>

        <h3>Datos personales</h3>
        <div className="field">
          <label>Nombre Completo</label>
          <input type="text" name="nombre" maxLength={60} required defaultValue={state.nombre ?? ''} />
        </div>
        <div className="field">
          <label>Número de afiliación</label>
          <input type="text" name="numero_afiliacion" maxLength={8} required defaultValue={state.numero_afiliacion ?? ''} />
        </div>  

        <h3>Información General de la consulta</h3>

        <div className="field">
          <label>Fecha de evaluación</label>
          <input type="datetime-local" name="fecha_consulta" value={fechaEvaluacion} readOnly />
        </div>
        <div className="field">
          <label>Motivo de consulta</label>
          <textarea name="motivo" rows={4} />
        </div>
        <div className="field">
          <label>Síntomas</label>
          <textarea name="sintomas" rows={4} />
        </div>
        <div className="field">
          <label>Tiempo de evolución</label>
          <textarea name="tiempo_enfermedad" rows={4} />
        </div>

        <h3>Exploración física</h3>
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
            name="frecuencia_c
            ardiaca"
            min={30}
            max={220}
            placeholder="Ej. 72"
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

        <h3>Diagnóstico y tratamiento</h3>

        <label>Diagnóstico</label>
        <div className="field">
          <textarea name="diagnostico" rows={4} />
        </div>

        <label>Tratamiento</label>
        <div className="field">
          <textarea name="tratamiento" rows={4} />
        </div>
        <label>Medicamentos recetados</label>
        <div className="field">
          <textarea name="medicamentos_recetados" rows={4} />
        </div>
        <label>Observaciones</label>
        <div className="field">
          <textarea name="observaciones" rows={4} />
        </div>
      </section>

      
      <div className="contenedor-botones-consulta">
        <button className="btn-consulta btn-guardar">Guardar cambios</button>
        <button className="btn-consulta btn-finalizar">Finalizar consulta</button>
      </div>
    </div>
    
  )
}
