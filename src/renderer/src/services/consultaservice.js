const API_URL = "http://localhost:5000";

/* Crear consulta */
export const crearConsulta = async (consulta) => {
  const res = await fetch(`${API_URL}/consultas`, {
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
export const obtenerConsultasPorPaciente = async (pacienteId) => {
  const res = await fetch(`${API_URL}/consultas/paciente/${pacienteId}`);
  return res.json();
};

/* Detalle de consulta */
export const obtenerConsulta = async (consultaId) => {
  const res = await fetch(`${API_URL}/consultas/${consultaId}`);
  return res.json();
};

/* Actualizar consulta */
export const actualizarConsulta = async (consultaId, data) => {
  const res = await fetch(`${API_URL}/consultas/${consultaId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error al actualizar consulta");
  return res.json();
};

/* Eliminar consulta */
export const eliminarConsulta = async (consultaId) => {
  const res = await fetch(`${API_URL}/consultas/${consultaId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Error al eliminar consulta");
  return res.json();
};
