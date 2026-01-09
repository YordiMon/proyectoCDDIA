//import Versions from './components/Versions'
import React from 'react'
import { useNavigate } from 'react-router-dom'

function App(): React.JSX.Element {
  const navigate = useNavigate()

  return (
    <div className="app-container">
      <h1>Hola Electron + React</h1>
      <h2>Clinica CDDIA</h2>
      <button onClick={() => navigate('/consulta')}>Ir a Consulta</button>
    </div>
  )
}

export default App
