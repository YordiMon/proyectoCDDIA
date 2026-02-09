import { API_BASE_URL } from '../config';

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
  mensaje: string
  id: number
}

export interface RespuestaQuitarEspera {
  mensaje: string;
  id: number;
  numero_afiliacion: string;
  estado: string;
}


export interface RespuestaExistePaciente {
  paciente_id: number
  nombre: string
  numero_afiliacion: string
}


// ======== Funciones del servicio ========

/**
 * Crear un nuevo paciente
 */
export const crearPaciente = async (
  paciente: Paciente
): Promise<RespuestaCrearPaciente> => {

  const res = await fetch(`${API_BASE_URL}/crear_paciente`, {
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
    `${API_BASE_URL}/paciente/${numero_afiliacion}`
  );

  const data = await res.json();



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

  const res = await fetch(`${API_BASE_URL}/pacientes/${id}`);

  const data = await res.json();

  if (!res.ok) {
    throw data;
  }

  return data;
}

/* quitar paciente por número de afiliación */
export const eliminarPacientePorAfiliacion = async (
  numero_afiliacion: string
): Promise<RespuestaQuitarEspera> => {
  const res = await fetch(
    `${API_BASE_URL}/quitar_paciente_por_afiliacion/${numero_afiliacion}`,
    { method: 'PUT' }
  );

  if (!res.ok) {
    throw new Error('Paciente no encontrado');
  }

  return res.json();
};

//Editar paciente por ID
export const EditarPaciente = async (
  id: number,
  datos: Partial<Paciente>
): Promise<any> => {
  const res = await fetch(
    `${API_BASE_URL}/editar_paciente/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.mensaje || "Error al editar paciente");
  }

  return res.json();
};
