// src/renderer/src/hooks/usePacientes.ts
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export interface Paciente {
  id: number;
  nombre: string;
  numero_afiliacion: string;
  creado: string;
  estado: string;
}

export function usePacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);

  // src/renderer/src/hooks/usePacientes.ts
    const fetchPacientes = async () => {
    try {
        setLoading(true);
        console.log("DEBUG: La URL de la API es:", API_BASE_URL);
        console.log("Consultando a:", `${API_BASE_URL}/lista_pacientes_en_espera`);
        
        const response = await fetch(`${API_BASE_URL}/lista_pacientes_en_espera`);
        const data = await response.json();
        
        console.log("Datos recibidos de la API:", data); // <--- REVISA ESTO EN LA CONSOLA
        setPacientes(data);
    } catch (error) {
        console.error("Error cargando pacientes:", error);
    } finally {
        setLoading(false);
    }
    };

  useEffect(() => {
    fetchPacientes();
  }, []);

  return { pacientes, loading, refetch: fetchPacientes };
}