import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Package, 
  ClipboardList, 
  Users, 
  Settings, 
  Bell, 
  Search,
  Menu as MenuIcon,
  X,
  LogOut,
  UtensilsCrossed,
  User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, userRole } = useAuth();

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => navigate(userRole === 'admin' ? '/dashboard' : '/menu')}
          >
            <Package className="h-8 w-8" />
            <span className="ml-2 text-xl font-bold">OrderPro</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Search bar - solo para administrador */}
            {userRole === 'admin' && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar pedido..."
                  className="w-64 px-4 py-1 rounded-lg text-gray-800 bg-white/90 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <Search className="absolute right-3 top-1.5 h-5 w-5 text-gray-500" />
              </div>
            )}

            <div className="flex items-center space-x-6">
              <NavLink 
                to="/orders" 
                icon={<ClipboardList className="h-5 w-5" />} 
                text="Pedidos"
                isActive={location.pathname === '/orders'}
              />
              <NavLink 
                to="/menu" 
                icon={<UtensilsCrossed className="h-5 w-5" />} 
                text="Menú del Día"
                isActive={location.pathname.startsWith('/menu')}
              />
              {userRole === 'admin' && (
                <>
                  <NavLink 
                    to="/users" 
                    icon={<Users className="h-5 w-5" />} 
                    text="Clientes"
                    isActive={location.pathname === '/users'}
                  />
                  <NavLink 
                    to="/pending-users" 
                    icon={<Users className="h-5 w-5" />} 
                    text="Usuarios Pendientes"
                    isActive={location.pathname === '/pending-users'}
                  />
                  <NavLink 
                    to="/settings" 
                    icon={<Settings className="h-5 w-5" />} 
                    text="Opciones"
                    isActive={location.pathname === '/settings'}
                  />
                </>
              )}
              
              {/* Notifications - solo para administrador */}
              {userRole === 'admin' && (
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative"
                  >
                    <Bell className="h-5 w-5 cursor-pointer hover:text-indigo-200 transition-colors" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      3
                    </span>
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 text-gray-800 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <h3 className="text-sm font-semibold">Notificaciones</h3>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50">
                        <p className="text-sm font-medium">Nuevo Pedido</p>
                        <p className="text-xs text-gray-500">Pedido #123 recibido</p>
                        <p className="text-xs text-gray-400 mt-1">hace 2 minutos</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3"
                >
                  <img
                    className="h-8 w-8 rounded-full border-2 border-white cursor-pointer"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User profile"
                  />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 text-gray-800 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      Mi Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-indigo-700 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-indigo-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <MobileNavLink 
              to="/orders" 
              icon={<ClipboardList className="h-5 w-5" />} 
              text="Pedidos"
              isActive={location.pathname === '/orders'}
            />
            <MobileNavLink 
              to="/menu" 
              icon={<UtensilsCrossed className="h-5 w-5" />} 
              text="Menú del Día"
              isActive={location.pathname.startsWith('/menu')}
            />
            {userRole === 'admin' && (
              <>
                <MobileNavLink 
                  to="/users" 
                  icon={<Users className="h-5 w-5" />} 
                  text="Clientes"
                  isActive={location.pathname === '/users'}
                />
                <MobileNavLink 
                  to="/pending-users" 
                  icon={<Users className="h-5 w-5" />} 
                  text="Usuarios Pendientes"
                  isActive={location.pathname === '/pending-users'}
                />
                <MobileNavLink 
                  to="/settings" 
                  icon={<Settings className="h-5 w-5" />} 
                  text="Opciones"
                  isActive={location.pathname === '/settings'}
                />
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

const NavLink = ({ to, icon, text, isActive }: { to: string; icon: React.ReactNode; text: string; isActive: boolean }) => (
  <Link
    to={to}
    className={`flex items-center space-x-1 transition-colors cursor-pointer ${
      isActive ? 'text-white font-semibold' : 'text-indigo-100 hover:text-white'
    }`}
  >
    {icon}
    <span>{text}</span>
  </Link>
);

const MobileNavLink = ({ to, icon, text, isActive }: { to: string; icon: React.ReactNode; text: string; isActive: boolean }) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
      isActive ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
    }`}
  >
    {icon}
    <span>{text}</span>
  </Link>
);