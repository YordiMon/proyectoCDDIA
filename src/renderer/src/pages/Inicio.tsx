//import { useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/inicio.css';
import {   BarChart3, 
  ClipboardList,
  Users } from 'lucide-react';

export default function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="pagina-inicio">

         {/* ENCABEZADO */}
    <div className="header1">
 <div className="header1">
    <h1 className="titulo-principal">
          Código de Identificación Asistencia Sanitaria
    </h1>
       <p className="subtitulo">
          Sistema de control y atención de pacientes
       </p>
 </div>
      </div>
<div className="separador-inicio"></div>


      {/* BOTONES CENTRALES */}
     <div className="cards-contenedor">
      <div
        className="card-inicio"
        onClick={() => navigate("/expedientes")}
      >
        <ClipboardList size={40} className="icono-card" />
        <h3>Expedientes</h3>
        <p>Ver y administrar expedientes y pacientes</p>
      </div>

      <div
        className="card-inicio"
        onClick={() => navigate("/lista-espera")}
      >
        <Users size={40} className="icono-card" />
        <h3>Lista de espera</h3>
        <p>Atender pacientes en espera</p>
      </div>

       <div
        className="card-inicio"
        onClick={() => navigate("/estadisticas")}
      >
        <BarChart3 size={40} className="icono-card" />
        <h3>Métricas</h3>
        <p>Ver estadísticas de los pacientes atendidos </p>
      </div>




     </div>


      {/* TEXTO INFERIOR */}
      <div className="textInferior">
        <span>Casa de Día</span>
        <span className="footer-divider">•</span>
        <span>Sección 54 SNTE</span>
      </div>


    </div>
  );
}
