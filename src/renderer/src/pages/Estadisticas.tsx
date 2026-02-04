import React, { useState, useEffect } from 'react';
import '../styles/Estadisticas.css';
import { API_BASE_URL } from '../config';

interface StatData {
  anio: number;
  periodo: number;
  total: number;
  hombres: number;
  mujeres: number;
}

const obtenerNombreMes = (num: number) => {
  const meses = [
    '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return meses[num] || num;
};

export default function Estadisticas() {
  const [datos, setDatos] = useState<StatData[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  
  const [periodo, setPeriodo] = useState<string>('month');
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');

  const obtenerEstadisticas = async () => {
    setCargando(true);
    try {
      const params = new URLSearchParams();
      params.append('periodo', periodo);
      if (fechaInicio) params.append('fecha_inicio', fechaInicio);
      if (fechaFin) params.append('fecha_fin', fechaFin);

      const response = await fetch(`${API_BASE_URL}/stats/pacientes-atendidos?${params.toString()}`);
      if (!response.ok) throw new Error('Error al obtener datos');
      
      const data = await response.json();
      setDatos(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error cargando las estadísticas");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerEstadisticas();
  }, [periodo]);

  return (
    <div className="stats-container">
      <h1 className="stats-title">Reporte de Pacientes Atendidos</h1>

      {/* --- PANEL DE CONTROLES --- */}
      <div className="stats-controls">
        
        <div className="control-group">
          <label>Agrupar por:</label>
          <select 
            className="control-input"
            value={periodo} 
            onChange={(e) => setPeriodo(e.target.value)}
          >
            <option value="day">Días</option>
            <option value="week">Semanas</option>
            <option value="month">Meses</option>
            <option value="year">Años</option>
          </select>
        </div>

        <div className="control-group">
          <label>Desde:</label>
          <input 
            type="date" 
            className="control-input"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>

        <div className="control-group">
          <label>Hasta:</label>
          <input 
            type="date" 
            className="control-input"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>

        <button onClick={obtenerEstadisticas} className="btn-consultar">
          {cargando ? 'Cargando...' : 'Actualizar Reporte'}
        </button>
      </div>

      {/* --- TABLA DE RESULTADOS --- */}
      <div className="table-container">
        {datos.length === 0 ? (
          <div className="no-data">No hay datos para el rango seleccionado.</div>
        ) : (
          <table className="stats-table">
            <thead>
              <tr>
                <th>Año</th>
                <th>
                  {periodo === 'month' ? 'Mes' : periodo === 'week' ? 'Semana #' : periodo === 'day' ? 'Día' : 'Periodo'}
                </th>
                <th>Total Pacientes</th>
                <th className="col-hombres">Hombres</th>
                <th className="col-mujeres">Mujeres</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((fila, index) => (
                <tr key={`${fila.anio}-${fila.periodo}-${index}`}>
                  <td className="text-bold">{fila.anio}</td>
                  <td className="text-bold">
                    {periodo === 'month' ? obtenerNombreMes(fila.periodo) : fila.periodo}
                  </td>
                  <td className="text-bold">{fila.total}</td>
                  <td className="col-hombres">{fila.hombres}</td>
                  <td className="col-mujeres">{fila.mujeres}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="table-footer">
               <tr>
                 <td colSpan={2} style={{textAlign: 'right', paddingRight: '20px'}}>TOTAL GLOBAL:</td>
                 <td>{datos.reduce((acc, curr) => acc + curr.total, 0)}</td>
                 <td className="col-hombres">{datos.reduce((acc, curr) => acc + curr.hombres, 0)}</td>
                 <td className="col-mujeres">{datos.reduce((acc, curr) => acc + curr.mujeres, 0)}</td>
               </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}