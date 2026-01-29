import { API_BASE_URL } from '../config';

export const finalizarAtencion = async (idPacienteEspera: number) => {
  const res = await fetch(
    `${API_BASE_URL}/quitar_paciente/${idPacienteEspera}`,
    { method: 'PUT' }
  )

  if (!res.ok) {
    throw new Error('No se pudo finalizar la atención')
  }

  return res.json()
}

export const verificarPacienteEnEspera = async (numero_afiliacion: string) => {
  const res = await fetch(
    `${API_BASE_URL}/verificar_paciente_en_espera/${numero_afiliacion}`,
    { method: 'PUT' }
  )

  if (!res.ok) {
    throw new Error('Error al verificar paciente en espera')
  }

  return res.json()
}

