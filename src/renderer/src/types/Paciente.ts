export interface Paciente {
  id: number;
  nombre: string;
  numero_afiliacion: string;
  fecha_nacimiento: string;
  sexo: string;
  celular: string;
  contacto_emergencia: string;
  direccion: string;
  tipo_sangre: string;
  recibe_donaciones: boolean;
  alergias: string;
  enfermedades: string;
  cirugias_previas: string;
  medicamentos_actuales: string;
}
