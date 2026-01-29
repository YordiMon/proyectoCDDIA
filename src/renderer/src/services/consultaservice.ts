import { API_BASE_URL } from '../config';

interface Consulta {
  paciente_id: number
  fecha_consulta: string
  motivo: string
  sintomas?: string
  tiempo_enfermedad?: string
  presion?: string
  frecuencia_cardiaca?: number
  frecuencia_respiratoria?: number
  temperatura?: number
  peso?: number
  talla?: number
  diagnostico?: string
  medicamentos_recetados?: string
  observaciones?: string
}

interface Paciente {
  id: number;
  nombre: string;
  numero_afiliacion: string;
}

/* Buscar paciente por número de afiliación */
export const buscarPacientePorAfiliacion = async (numero_afiliacion: string): Promise<Paciente> => {
  const res = await fetch(`${API_BASE_URL}/paciente/${numero_afiliacion}`);
  
  if (!res.ok) {
    throw new Error("Paciente no encontrado");
  }

  return res.json();
};




/* Crear consulta */
export const crearConsulta = async (consulta: Consulta): Promise<{ message: string; consulta_id: number }> => {
  const res = await fetch(`${API_BASE_URL}/consultas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(consulta),
  });

  if (!res.ok) {
    const error = await res.json();
    throw error;
  }

  return res.json();
};

/* Consultas por paciente */
export const obtenerConsultasPorPaciente = async (pacienteId: number): Promise<Consulta[]> => {
  const res = await fetch(`${API_BASE_URL}/consultas/paciente/${pacienteId}`);
  return res.json();
};

/* Detalle de consulta */
export const obtenerConsulta = async (consultaId: number): Promise<Consulta> => {
  const res = await fetch(`${API_BASE_URL}/consultas/${consultaId}`);
  return res.json();
};

/* Actualizar consulta */
export const actualizarConsulta = async (consultaId: number, data: Partial<Consulta>): Promise<Consulta> => {
  const res = await fetch(`${API_BASE_URL}/consultas/${consultaId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error al actualizar consulta");
  return res.json();
};

/* Eliminar consulta */
export const eliminarConsulta = async (consultaId: number): Promise<{ message: string }> => {
  const res = await fetch(`${API_BASE_URL}/consultas/${consultaId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Error al eliminar consulta");
  return res.json();
};

export const marcarPacienteEnAtencion = async (numero_afiliacion: string) => {
  const res = await fetch(
    `${API_BASE_URL}/marcar_paciente/${numero_afiliacion}`,
    { method: 'PUT' }
  )

  if (!res.ok) {
    throw new Error('No se pudo marcar paciente')
  }

  return res.json()
}
