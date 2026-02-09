import { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  Info, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import '../styles/Estadisticas.css';

interface StatData {
  anio: number;
  mes: number;
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
  const [cargando, setCargando] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [periodo, setPeriodo] = useState<string>('month');
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');

  // Modificamos la función para aceptar fechas opcionales y evitar leer estados "viejos"
  const obtenerEstadisticas = async (manual = false, fInicioOverride?: string, fFinOverride?: string) => {
    if (manual) setIsRefreshing(true);
    else setCargando(true);
    
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append('periodo', periodo);

      // Priorizamos los parámetros de override (limpieza) sobre el estado actual
      const fInicioActual = fInicioOverride !== undefined ? fInicioOverride : fechaInicio;
      const fFinActual = fFinOverride !== undefined ? fFinOverride : fechaFin;

      let fInicioEnvio = fInicioActual;
      let fFinEnvio = fFinActual;

      // Lógica de formateo inclusivo
      if (periodo === 'month' && fInicioActual) {
        fInicioEnvio = `${fInicioActual}-01`;
        if (fFinActual) {
          const [y, m] = fFinActual.split('-').map(Number);
          const ultimoDia = new Date(y, m, 0).getDate();
          fFinEnvio = `${fFinActual}-${ultimoDia}`;
        }
      } else if (periodo === 'year' && fInicioActual) {
        fInicioEnvio = `${fInicioActual}-01-01`;
        if (fFinActual) fFinEnvio = `${fFinActual}-12-31`;
      }

      if (fInicioEnvio) params.append('fecha_inicio', fInicioEnvio);
      if (fFinEnvio) params.append('fecha_fin', fFinEnvio);
      
      const response = await fetch(`${API_BASE_URL}/stats/pacientes-atendidos?${params.toString()}`);
      
      if (!response.ok) throw new Error();
      
      const data = await response.json();
      setDatos(data);
    } catch (err) {
      setError("No se pudo conectar con el servidor. Verifica tu conexión a internet.");
    } finally {
      setCargando(false);
      setIsRefreshing(false);
    }
  };

  // Al cambiar el periodo, limpiamos explícitamente y forzamos la carga con strings vacíos
  useEffect(() => {
    setFechaInicio('');
    setFechaFin('');
    obtenerEstadisticas(false, '', ''); 
  }, [periodo]);

  const totalPacientes = datos.reduce((acc, curr) => acc + curr.total, 0);
  const totalHombres = datos.reduce((acc, curr) => acc + curr.hombres, 0);
  const totalMujeres = datos.reduce((acc, curr) => acc + curr.mujeres, 0);

  // 1. Pantalla de carga inicial (Mismo diseño que Expedientes)
  if (cargando && !isRefreshing) {
    return (
      <div className="contenedor-pacientes centro-total">
        <Loader2 className="spinner-animado" size={50} />
        <p>Conectando con el servidor...</p>
      </div>
    );
  }

  // 2. Pantalla de error (Mismo diseño que Expedientes)
  if (error) {
    return (
      <div className="contenedor-espera centro-total">
        <div className="mensaje-estado error-box">
          <AlertCircle size={48} color="#4c4c4c" />
          <h4>Error de conexión</h4>
          <p>{error}</p>
          <p className="btn-reintentar" onClick={() => obtenerEstadisticas()}>
            Reintentar conexión
          </p>
        </div>
      </div>
    );
  }

  // 3. Pantalla normal
  return (
    <div className="contenedor-espera">
      <h1>Métricas de pacientes atendidos</h1>
      <p className='minusp'>Visualiza el flujo de pacientes atendidos. No se toman en cuenta pacientes sin historial de consultas y los pacientes con una o múltiples consultas en un mismo periodo solo se toman en cuenta una vez.</p>

      <div className="stats-controls">
        <div className="campo-form">
          <label>Agrupar por</label>
          <select 
            value={periodo} 
            onChange={(e) => setPeriodo(e.target.value)} 
            className="valor-real"
          >
            <option value="day">Día</option>
            <option value="week">Semana del mes</option>
            <option value="month">Mes</option>
            <option value="year">Año</option>
          </select>
        </div>

        <div className="campo-form">
          <label>{periodo === 'year' ? 'Año inicio' : 'Desde'}</label>
          <input
            type={periodo === 'month' ? 'month' : periodo === 'year' ? 'number' : 'date'}
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="valor-real"
            placeholder={periodo === 'year' ? 'Ej: 2023' : ''}
          />
        </div>

        <div className="campo-form">
          <label>{periodo === 'year' ? 'Año fin' : 'Hasta'}</label>
          <input
            type={periodo === 'month' ? 'month' : periodo === 'year' ? 'number' : 'date'}
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="valor-real"
            placeholder={periodo === 'year' ? 'Ej: 2024' : ''}
          />
        </div>

        <button 
          className="btn-flotante-registrar" 
          onClick={() => obtenerEstadisticas(true)} 
          disabled={isRefreshing}
        >
          <RefreshCw size={20} className={isRefreshing ? 'girando' : ''} />
          <span>Actualizar</span>
        </button>
      </div>

      <div className="zona-contenido">
        {datos.length === 0 ? (
          <div className="mensaje-estado vacio-box">
             <Info size={38} color="#4c4c4c" />
             <h4>Sin resultados</h4>
             <p>No se encontraron registros para el periodo seleccionado.</p>
          </div>
        ) : (
          <div className={`tabla-wrapper ${isRefreshing ? 'opacidad-baja' : ''}`}>
            <table className="tabla-pacientes">
              <thead>
                <tr>
                  <th>Año</th>
                  <th>Periodo</th>
                  <th>Total Pacientes</th>
                  <th className="col-hombres">Hombres</th>
                  <th className="col-mujeres">Mujeres</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((fila, index) => (
                  <tr key={index}>
                    <td className="col-nombre">{fila.anio}</td>
                    {periodo !== 'year' && (
                      <td className="col-nombre">
                        {periodo === 'month' && obtenerNombreMes(fila.mes)}
                        {periodo === 'week' && `Semana ${fila.periodo} de ${obtenerNombreMes(fila.mes)}`}
                        {periodo === 'day' && `${fila.periodo} de ${obtenerNombreMes(fila.mes)}`}
                      </td>
                    )}
                    <td className="col-nombre">{fila.total}</td>
                    <td className="col-nombre">{fila.hombres}</td>
                    <td className="col-nombre">{fila.mujeres}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {datos.length > 0 && (
        <div className="panel-totales-flotante">
          <div className="panel-totales-titulo">Totales del rango seleccionado</div>
          <div className='linea-div'></div>
          <div className="panel-totales-item">
            <span className="panel-totales-label">Total:</span>
            <span className="panel-totales-valor">{totalPacientes}</span>
          </div>
          <div className="panel-totales-item">
            <span className="panel-totales-label">Hombres:</span>
            <span className="panel-totales-valor">{totalHombres}</span>
          </div>
          <div className="panel-totales-item">
            <span className="panel-totales-label">Mujeres:</span>
            <span className="panel-totales-valor">{totalMujeres}</span>
          </div>
        </div>
      )}
    </div>
  );
}