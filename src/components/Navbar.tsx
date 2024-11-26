import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Package,
  ClipboardList,
  Users,
  Settings,
  Search,
  Menu as MenuIcon,
  X,
  LogOut,
  UtensilsCrossed,
  User,
  Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { customerApi } from "../services/Customer.ts";
import axios from 'axios';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>(DEFAULT_AVATAR);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, userRole, user, isAuthenticated } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const loadAvatar = async () => {
      if (!isAuthenticated || !user?.email) {
        setIsLoadingAvatar(false);
        return;
      }

      setIsLoadingAvatar(true);
      try {
        const userId = user.id;
        const url = await customerApi.getAvatar(userId);
        if (isMounted && url) {
          setAvatarUrl(url);
        }
      } catch (error) {
        if (isMounted) {
          setAvatarUrl(DEFAULT_AVATAR);
          if (axios.isAxiosError(error) && error.response?.status !== 404) {
            toast.error('Error al cargar el avatar', {
              id: 'avatar-error',
            });
          }
        }
      } finally {
        if (isMounted) {
          setIsLoadingAvatar(false);
        }
      }
    };

    loadAvatar();

    return () => {
      isMounted = false;
      if (avatarUrl && avatarUrl !== DEFAULT_AVATAR) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [user?.email, isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-menu')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      logout();
      navigate('/login');
    }
  };

  const canManageMenu = userRole === 'admin' || userRole === 'cashier';
  const isAdmin = userRole === 'admin';

  return (
      <nav className="bg-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div
                className="flex items-center cursor-pointer"
                onClick={() => navigate(canManageMenu ? '/dashboard' : '/menu')}
            >
              <img 
                src="Images/Navbar.png" 
                alt="Logo" 
                className="h-22 w-28 object-contain" 
            />
            </div>

            <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
              {canManageMenu && (
                  <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar pedido..."
                        className="w-48 lg:w-64 px-4 py-1 rounded-lg text-gray-800 bg-white/90 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <Search className="absolute right-3 top-1.5 h-5 w-5 text-gray-500" />
                  </div>
              )}

              <div className="flex items-center space-x-4 lg:space-x-6">
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
                {isAdmin && (
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
              </div>

              <div className="relative profile-menu">
                <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-3 hover:bg-indigo-500 rounded-full p-1 transition-colors"
                >
                  {isLoadingAvatar ? (
                      <div className="h-8 w-8 rounded-full border-2 border-white flex items-center justify-center bg-indigo-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                  ) : (
                      <img
                          className="h-8 w-8 rounded-full border-2 border-white cursor-pointer object-cover"
                          src={avatarUrl}
                          alt="User profile"
                          onError={() => setAvatarUrl(DEFAULT_AVATAR)}
                      />
                  )}
                </button>

                {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-1 text-gray-800 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium truncate">{user?.email}</p>
                        <p className="text-xs text-gray-500">
                          {userRole === 'admin' ? 'Administrador' : userRole === 'cashier' ? 'Cajero' : 'Usuario'}
                        </p>
                      </div>
                      <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="h-4 w-4 mr-3" />
                        Mi Perfil
                      </Link>
                      <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Cerrar Sesión
                      </button>
                    </div>
                )}
              </div>
            </div>

            <div className="md:hidden flex items-center">
              <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md hover:bg-indigo-500 focus:outline-none transition-colors"
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

        {isMobileMenuOpen && (
            <div className="md:hidden bg-indigo-700">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {canManageMenu && (
                    <div className="px-3 py-2">
                      <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar pedido..."
                            className="w-full px-4 py-2 rounded-lg text-gray-800 bg-white/90 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-500" />
                      </div>
                    </div>
                )}

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
                {isAdmin && (
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

                <div className="border-t border-indigo-800 mt-2 pt-2">
                  <MobileNavLink
                      to="/profile"
                      icon={<User className="h-5 w-5" />}
                      text="Mi Perfil"
                      isActive={location.pathname === '/profile'}
                  />
                  <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-2 text-indigo-100 hover:bg-indigo-800 rounded-md"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            </div>
        )}
      </nav>
  );
}

const NavLink = ({ to, icon, text, isActive }: { to: string; icon: React.ReactNode; text: string; isActive: boolean }) => (
    <Link
        to={to}
        className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors ${
            isActive
                ? 'text-white bg-indigo-500 font-semibold'
                : 'text-indigo-100 hover:text-white hover:bg-indigo-500'
        }`}
    >
      {icon}
      <span className="text-sm">{text}</span>
    </Link>
);

const MobileNavLink = ({ to, icon, text, isActive }: { to: string; icon: React.ReactNode; text: string; isActive: boolean }) => (
    <Link
        to={to}
        className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
            isActive
                ? 'bg-indigo-800 text-white'
                : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
        }`}
    >
      {icon}
      <span>{text}</span>
    </Link>
);