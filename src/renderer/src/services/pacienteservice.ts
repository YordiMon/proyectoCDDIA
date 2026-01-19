const API_URL = "http://localhost:5000";

// ======== Interfaces ========

export interface Paciente {
  nombre: string;
  numero_afiliacion: string;
  fecha_nacimiento: string;   // formato YYYY-MM-DD
  sexo: string;
  tipo_sangre: string;
  recibe_donaciones: boolean;
  direccion: string;
  celular: string;
  contacto_emergencia?: string;
  enfermedades?: string;
  alergias?: string;
  cirugias_previas?: string;
  medicamentos_actuales?: string;
}

export interface RespuestaCrearPaciente {
  mensaje: string;
  id: number;
}

export interface RespuestaExistePaciente {
  existe: boolean;
  paciente_id?: number;
  nombre?: string;
}

// ======== Funciones del servicio ========

/**
 * Crear un nuevo paciente
 */
export const crearPaciente = async (
  paciente: Paciente
): Promise<RespuestaCrearPaciente> => {

  const res = await fetch(`${API_URL}/crear_paciente`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paciente),
  });

  const data = await res.json();

  if (!res.ok) {
    throw data;
  }

  return data;
};

/**
 * Verificar si un paciente ya existe por número de afiliación
 */
export const existePaciente = async (numero_afiliacion: string): 
Promise<RespuestaExistePaciente> => {

  const res = await fetch(
    `${API_URL}/paciente_existe/${numero_afiliacion}`
  );

  const data = await res.json();

  // DEBUG
  console.log('Status:', res.status);
  console.log('Respuesta bruta:', JSON.stringify(data, null, 2));
  console.log('res.ok:', res.ok);

  if (!res.ok) {
    console.error('Error HTTP detectado. Status:', res.status);
    throw new Error(`HTTP ${res.status}: ${JSON.stringify(data)}`);
  }

  return data;
};


/**
 * Obtener un paciente por ID
 */
export const obtenerPacientePorId = async (id: number): Promise<Paciente> => {

  const res = await fetch(`${API_URL}/pacientes/${id}`);

  const data = await res.json();

  if (!res.ok) {
    throw data;
  }

  return data;
}

