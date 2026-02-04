import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../config';


export interface Paciente {
  id: number;
  nombre: string;
  numero_afiliacion: string;
  creado: string;
  area: string;
  estado: string;
}

export function usePacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [totalEspera, setTotalEspera] = useState<number | string>('X');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null); 

  const fetchPacientes = useCallback(async (isUpdate = false) => {
    try {
      // Si NO es update (es decir, es carga inicial o REINTENTO), activamos loading total
      if (isUpdate) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      
      setError(null); 

      const response = await fetch(`${API_BASE_URL}/lista_pacientes_en_espera`);
      
      if (!response.ok) throw new Error('Servidor no disponible');
      
      const data = await response.json();
      setPacientes(data.pacientes);
      setTotalEspera(data.resumen.total_espera);
    } catch (err) {
      console.error("Error de conexión:", err);
      setError("No se pudo conectar con el servidor. Verifica tu conexión a internet.");
      setTotalEspera("?"); 
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const atenderPaciente = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/atender_paciente/${id}`, { method: 'PUT' });
      if (response.ok) {
        setPacientes(prev => prev.map(p => 
          p.id === id ? { ...p, estado: '2' } : p
        ));
        setTotalEspera(prev => typeof prev === 'number' ? Math.max(0, prev - 1) : prev);
        return true;
      }
    } catch (e) { console.error(e); }
    return false;
  };

  const quitarPaciente = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quitar_paciente/${id}`, { method: 'PUT' });
      if (response.ok) {
        setPacientes(prev => prev.filter(p => p.id !== id))
         return true
      }
    } catch (e) { console.error(e); }
    return false;
  };

  useEffect(() => {
    fetchPacientes();
  }, [fetchPacientes]);

  return { 
    pacientes, 
    totalEspera, 
    loading, 
    isRefreshing, 
    error, 
    atenderPaciente, 
    quitarPaciente,
    // CLAVE: pasamos el parámetro al fetch original
    recargarLista: (isUpdate: boolean = true) => fetchPacientes(isUpdate)
  };
}