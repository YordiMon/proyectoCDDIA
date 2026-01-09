import React from 'react'

function Consulta(): React.JSX.Element {
  return (
    <div className="consulta-container">
      <head>
      <h1>Consulta</h1>
      <p>Aquí va la vista de consulta.</p>
      <br />
      <br />
      </head>
   
        <h2>Detalles de la consulta</h2>
        
        <p>Fecha de la consulta</p>
        <input type="date" />
        <p>Motivo de la consulta</p>
        <input type="text" placeholder="Ingrese el motivo de la consulta" />
        
        
    </div>
  )
}

export default Consulta
