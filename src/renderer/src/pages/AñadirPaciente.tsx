// src/renderer/src/pages/AnadirPaciente.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, UserPlus, AlertCircle } from 'lucide-react'; 
import { API_BASE_URL } from '../config';
import '../styles/AñadirPaciente.css';

export default function AnadirPaciente() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    numero_afiliacion: ''
  });

  // Aseguramos que el componente esté limpio al montar
  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim() || !formData.numero_afiliacion.trim()) {
      setErrorVisible(true);
      setTimeout(() => setErrorVisible(false), 3000);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/crear_paciente_en_espera`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate('/');
      } else {
        alert('Error al crear el paciente');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contenedor-anadir">
      <div className="cabecera-anadir">
        {/* tabindex="-1" para que el foco no se detenga en el botón de volver al usar Tab */}
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
        
        {/* 1. FOCO INICIAL: Número de afiliación */}
        <div className="campo-form">
          <div className="label-container">
            <label htmlFor="afiliacion">Número de afiliación</label>
            <span className={`contador ${formData.numero_afiliacion.length === 8 ? 'limite-alcanzado' : ''}`}>
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
            autoFocus /* Esto pone el cursor aquí al abrir la pantalla */
            tabIndex={1} /* Primer salto de Tab */
            autoComplete="off"
          />
        </div>

        {/* 2. SEGUNDO FOCO: Nombre completo */}
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
            tabIndex={2} /* Segundo salto de Tab */
            autoComplete="off"
          />
        </div>

        {errorVisible && (
          <div className="mensaje-error-flotante">
            <AlertCircle size={18} />
            <span>Todos los campos son obligatorios</span>
          </div>
        )}

        {/* 3. TERCER FOCO: Botón registrar */}
        <button 
          type="submit" 
          className="btn-flotante-registrar" 
          disabled={loading}
          title="Registrar en lista"
          tabIndex={3} /* Tercer salto de Tab */
        >
          <UserPlus size={24} />
          <span>{loading ? 'Guardando...' : 'Registrar paciente en lista de espera'}</span>
        </button>
      </form>
    </div>
  );
}