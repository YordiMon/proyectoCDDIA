import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, UserPlus, AlertCircle } from 'lucide-react'; 
import { API_BASE_URL } from '../config';
import '../styles/AñadirPaciente.css';

export default function AnadirPaciente() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Nuevo estado para manejar el mensaje de error dinámicamente
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    numero_afiliacion: ''
  })

  useEffect(() => {
    setLoading(false);
  }, []);

  // Función para mostrar el error por unos segundos y luego ocultarlo
  const mostrarError = (mensaje: string) => {
    setErrorMessage(mensaje);
    setTimeout(() => setErrorMessage(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nombre.trim() || !formData.numero_afiliacion.trim()) {
      mostrarError('Todos los campos son obligatorios');
      return;
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/crear_paciente_en_espera`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        navigate('/')
      } else {
        // En lugar de alert, usamos nuestra función
        mostrarError('Error en el servidor al crear el paciente');
      }
    } catch (error) {
      console.error('Error:', error);
      // En lugar de alert, usamos nuestra función
      mostrarError('No se pudo conectar al servidor. Verifica tu conexión.');
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="contenedor-anadir">
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

      <form className="formulario-limpio" id="form-paciente" onSubmit={handleSubmit} noValidate>
        
        <div className="campo-form">
          <div className="label-container">
            <label htmlFor="afiliacion">Número de afiliación</label>
            <span
              className={`contador ${formData.numero_afiliacion.length === 8 ? 'limite-alcanzado' : ''}`}>
              {formData.numero_afiliacion.length}/8
            </span>
          </div>
          <input
            type="text"
            id="afiliacion"
            placeholder="Ej. SS-98065"
            maxLength={8}
            value={formData.numero_afiliacion}
            onChange={(e) => setFormData({ ...formData, numero_afiliacion: e.target.value })}
            autoFocus 
            tabIndex={1}
            autoComplete="off"
          />
        </div>

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
            tabIndex={2}
            autoComplete="off"
          />
        </div>

        {/* Mensaje de error unificado y dinámico */}
        {errorMessage && (
          <div className="mensaje-error-flotante">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <button 
          type="submit" 
          className="btn-flotante-registrar" 
          disabled={loading}
          title="Registrar en lista"
          tabIndex={3}
        >
          <UserPlus size={24} />
          <span>{loading ? 'Guardando...' : 'Registrar paciente en lista de espera'}</span>
        </button>
      </form>
    </div>
  )
}
