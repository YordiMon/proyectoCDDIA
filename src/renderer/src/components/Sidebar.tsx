import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  
  Settings,
  ClipboardList,
  Users
} from 'lucide-react';
import './Sidebar.css';

export default function Sidebar(): React.ReactNode {
  const location = useLocation();

  const menuItems = [

    //{ name: 'Inicio', path: '/', icon: <ClipboardList size={18} /> },

    { name: 'Lista de espera', path: '/lista-espera', icon: <Users size={18} /> },
    
    { name: 'Expedientes', path: '/expedientes', icon: <ClipboardList size={18} /> },

    { type: 'divider' }, 
    
    { name: 'Métricas', path: '/estadisticas', icon: <BarChart3 size={18} /> },
    
    { type: 'divider' }, 
       
    { name: 'Ajustes', path: '/ajustes', icon: <Settings size={18} /> },
  ];

  return (
    <nav className="sidebar">
      <ul className="sidebar-list">
        {menuItems.map((item, index) => {
          if (item.type === 'divider') {
            return <li key={`divider-${index}`} className="sidebar-divider" />;
          }

          return (
            <li key={item.path}>
              <Link
                to={item.path!}
                className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-text">{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}