//import { API_BASE_URL } from '../config'
const API_URL = "http://localhost:5000";

export const quitarPacienteDeEspera = async (id: number) => {
  const res = await fetch(`${API_URL}/quitar_paciente/${id}`, {
      //const res = await fetch(`${API_BASE_URL}/quitar_paciente/${id}`, {

    method: 'PUT'
  })

  if (!res.ok) {
    throw new Error('No se pudo quitar al paciente de la lista de espera')
  }
}
