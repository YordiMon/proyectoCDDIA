import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, UserPlus, AlertCircle } from 'lucide-react'
import { API_BASE_URL } from '../config'
import '../styles/AñadirPaciente.css'

const AREAS_DISPONIBLES = [
  "Urgencias",
  "Consulta General",
  "Pediatría",
  "Ginecología",
  "Traumatología",
  "Cirugía",
  "Medicina Interna"
];

export default function AnadirPaciente() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    numero_afiliacion: '',
    area: ''
  });

  // 🔹 Estados para autocompletado
  const [sugerencias, setSugerencias] = useState<any[]>([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const mostrarError = (mensaje: string) => {
    setErrorMessage(mensaje);
    setTimeout(() => setErrorMessage(null), 4000);
  };

  // 🔹 Buscar pacientes en API
  const buscarPacientes = async (texto: string) => {
    if (texto.length < 2) {
      setSugerencias([]);
      setMostrarSugerencias(false);
      return;
    }

    try {
      const resp = await fetch(
        `${API_BASE_URL}/api/pacientes/buscar-historial?q=${texto}`
      );
      const data = await resp.json();
      setSugerencias(data);
      setMostrarSugerencias(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim() || !formData.numero_afiliacion.trim() || !formData.area) {
      mostrarError('Todos los campos son obligatorios, incluyendo el área.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/crear_paciente_en_espera`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        navigate('/');
      } else {
        mostrarError('Error en el servidor al crear el paciente');
      }
    } catch (error) {
      console.error('Error:', error);
      mostrarError('No se pudo conectar al servidor. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contenedor-espera">
      <div className="cabecera-anadir">
        <button
          onClick={() => navigate(-1)}
          className="btn-volver-minimal"
          title="Volver"
          type="button"
          tabIndex={-1}
        >
          <ChevronLeft size={32} strokeWidth={2.5} />
        </button>
        <h1>Añadir paciente a la lista</h1>
      </div>

      <form className="formulario-limpio" onSubmit={handleSubmit} noValidate>

        {/* NÚMERO DE AFILIACIÓN */}
        <div className="campo-form" style={{ position: 'relative' }}>
          <div className="label-container">
            <label htmlFor="afiliacion">Número de afiliación</label>
            <span className={`contador ${formData.numero_afiliacion.length === 8 ? 'limite-alcanzado' : ''}`}>
              {formData.numero_afiliacion.length}/8
            </span>
          </div>
          <p className='ola'>En este campo puede buscar pacientes que ya existen por afiliación o nombre, de no ser así debe agregarlo manualmente.</p>
          <input
            type="text"
            id="afiliacion"
            placeholder="Ej. 9812096578"
            maxLength={8}
            value={formData.numero_afiliacion}
            onChange={(e) => {
              const value = e.target.value;
              setFormData({ ...formData, numero_afiliacion: value });
              buscarPacientes(value);
            }}
            autoFocus
            autoComplete="off"
          />

          {/* 🔹 SUGERENCIAS */}
            {mostrarSugerencias && sugerencias.length > 0 && (
              <ul className="lista-sugerencias">
                {sugerencias.map((p) => (
                  <li
                    key={p.id}
                    onClick={() => {
                      setFormData({
                        ...formData,
                        numero_afiliacion: p.numero_afiliacion,
                        nombre: p.nombre
                      });
                      setSugerencias([]);
                      setMostrarSugerencias(false);
                    }}
                  >
                    {/* Primero el nombre, luego el número */}
                    <span className="sugerencia-nombre">{p.nombre}</span>
                    <span className="sugerencia-numero">Número de afiliación: {p.numero_afiliacion}</span>
                  </li>
                ))}
              </ul>
            )}
        </div>

        {/* NOMBRE */}
        <div className="campo-form">
          <div className="label-container">
            <label htmlFor="nombre">Nombre completo</label>
            <span className={`contador ${formData.nombre.length === 60 ? 'limite-alcanzado' : ''}`}>
              {formData.nombre.length}/60
            </span>
          </div>

          <input
            type="text"
            id="nombre"
            placeholder="Ej. Yordi Azael Monreal Zazueta"
            maxLength={60}
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            autoComplete="off"
          />
        </div>

        {/* ÁREA */}
        <div className="campo-form">
          <label htmlFor="area">Área de ingreso</label>
          <select
            id="area"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
          >
            <option value="" disabled hidden color='gray'>Seleccionar área</option>
            {AREAS_DISPONIBLES.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

        {errorMessage && (
          <div className="mensaje-error-flotante">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <button type="submit" className="btn-flotante-registrar" disabled={loading}>
          <UserPlus size={24} />
          <span>{loading ? 'Guardando...' : 'Registrar paciente en lista de espera'}</span>
        </button>
      </form>
    </div>
  );
}

