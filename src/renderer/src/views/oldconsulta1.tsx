import React from 'react'

function Consulta(): React.JSX.Element {
  return (
    <div className="consulta-container">
      
      <header>
        <h1>Consulta</h1>
        
      </header>

      <section>
        <h2>Detalles de la consulta</h2><br/>
        <p>Datos Personales</p>
        Fecha: <input type="date" name="fecha" id="fecha" /> <br />
        Edad: <input type="number" name="edad" id="edad" /> <br />
        Sexo: 
        <select name="sexo" id="sexo">
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
        </select> 
        <br />
        Tipo de sangre: 
        <select name="tipoSangre" id="tipoSangre">
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select> 
        <br />
        <p>Recibe donaciones: </p>
        <select name="donaciones" id="donaciones">
          <option value="si">Si</option>
          <option value="no">No</option>
        </select> 
        <br />

        Direccion: <input type="text" name="direccion" id="direccion" /> <br />
        Telefono: <input type="tel" name="telefono" id="telefono" /> <br />
        Contacto de emergencia:    
        <input type="text" name="contactoEmergencia" id="contactoEmergencia" /> <br />

        Fecha de evaluacion: <input type="date" name="fechaEvaluacion" id="fechaEvaluacion" /> 
        <br />
        <p>Historial Medico</p>
        Enfermedades: <textarea name="enfermedades" id="enfermedades" rows={4} cols={50}></textarea> <br />
        Alergias: <textarea name="alergias" id="alergias" rows={4} cols={50}></textarea> <br />
        Cirugias previas: <textarea name="cirugias" id="cirugias" rows={4} cols={50}></textarea> <br />

        <p>Motivo de consulta</p>
        <textarea name="motivoConsulta" id="motivoConsulta" rows={4} cols={50}></textarea> <br />
        <p>Sintomas</p>
        <textarea name="sintomas" id="sintomas" rows={4} cols={50}></textarea> <br />
        <p>Tiempo de evolucion</p>
        <textarea name="tiempoEvolucion" id="tiempoEvolucion" rows={4} cols={50}></textarea> <br />
           
        <p>Exploracion fisica</p>
        Precion arterial: <input type="text" name="presionArterial" id="presionArterial" /> <br />
        Frecuencia cardiaca: <input type="text" name="frecuenciaCardiaca" id="frecuenciaCardiaca" /> <br />
        Temperatura: <input type="text" name="temperatura" id="temperatura" /> <br />
        Frecuencia respiratoria: <input type="text" name="frecuenciaRespiratoria" id="frecuenciaRespiratoria" /> <br />
        Peso: <input type="text" name="peso" id="peso" /> <br />
        Talla: <input type="text" name="talla" id="talla" /> <br />

        <p>Diagnostico</p>
        <textarea name="diagnostico" id="diagnostico" rows={4} cols={50}></textarea> <br />
        <p>Tratamiento</p>
        <textarea name="tratamiento" id="tratamiento" rows={4} cols={50}></textarea> <br />
        <p>Medicamentos recetados</p>
        <textarea name="medicamentosRecetados" id="medicamentosRecetados" rows={4} cols={50}></textarea> <br />
        <p>Observaciones</p>
        <textarea name="observaciones" id="observaciones" rows={4} cols={50}></textarea> <br />
      </section>

    </div>
  )
}

export default Consulta
