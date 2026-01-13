// src/renderer/src/hooks/usePacientes.ts
import { useState, useEffect, useCallback } from 'react';
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
  const [totalEspera, setTotalEspera] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchPacientes = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await fetch(`${API_BASE_URL}/lista_pacientes_en_espera`);
      if (!response.ok) throw new Error('Error al cargar');
      
      const data = await response.json();
      setPacientes(data.pacientes);
      setTotalEspera(data.resumen.total_espera);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  const atenderPaciente = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/atender_paciente/${id}`, { method: 'PUT' });
      if (response.ok) {
        setPacientes(prev => prev.map(p => 
          p.id === id ? { ...p, estado: '2' } : p
        ));
        setTotalEspera(prev => Math.max(0, prev - 1));
        return true;
      }
    } catch (e) { console.error(e); }
    return false;
  };

  const quitarPaciente = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quitar_paciente/${id}`, { method: 'PUT' });
      if (response.ok) {
        const pacienteEliminado = pacientes.find(p => p.id === id);
        setPacientes(prev => prev.filter(p => p.id !== id));
        
        if (pacienteEliminado?.estado === '1') {
          setTotalEspera(prev => Math.max(0, prev - 1));
        }
        return true;
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
    atenderPaciente, 
    quitarPaciente,
    recargarLista: () => fetchPacientes(true)
  };
}