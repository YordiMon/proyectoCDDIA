import { Link, useLocation } from 'react-router-dom';
import { 
  ClipboardList, 
  Stethoscope, 
  Users, 
  UserCircle, 
  BarChart3, 
  Settings 
} from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: 'Lista de espera', path: '/', icon: <ClipboardList size={15} /> },
    { name: 'Consultas', path: '/consultas', icon: <Stethoscope size={15} /> },
    { name: 'Pacientes', path: '/pacientes', icon: <Users size={15} /> },
    { name: 'Perfil', path: '/perfil', icon: <UserCircle size={15} /> },
    { name: 'Estadísticas', path: '/estadisticas', icon: <BarChart3 size={15} /> },
    { name: 'Ajustes', path: '/ajustes', icon: <Settings size={15} /> },
  ];

  return (
    <nav className="sidebar">
      <ul className="sidebar-list">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-text">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}