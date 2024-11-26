import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Menu from './views/Menu';
import MenuEdit from './views/CreateDish.tsx';
import UserManagement from './views/UserManagement';
import Login from './views/Login';
import Register from './views/Register';
import AccountActivation from './views/AccountActivation';
import Profile from './views/Profile';
import ResetPassword from './views/ResetPassword';
import Dashboard from './views/Dashboard';
import UserOrders from './views/UserOrders';
import Orders from './views/Orders';
import Settings from './views/Settings';
import PendingUsers from './views/PendingUsers';
import { useAuth } from './contexts/AuthContext';

function AppContent() {
    const { isAuthenticated, userRole } = useAuth();
    const location = useLocation();

    const publicRoutes = ['/login', '/register', '/reset-password', '/activate'];
    const isStaff = userRole === 'admin' || userRole === 'cashier';

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                }}
            />
            {isAuthenticated && !publicRoutes.includes(location.pathname) && <Navbar />}
            <Routes>
                {/* Rutas públicas */}
                <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
                <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/activate" element={<AccountActivation />} />

                {/* Rutas protegidas */}
                {isAuthenticated ? (
                    <>
                        <Route path="/" element={
                            isStaff
                                ? <Navigate to="/dashboard" replace />
                                : <Navigate to="/menu" replace />
                        } />

                        {/* Rutas de administrador */}
                        {userRole === 'admin' && (
                            <>
                                <Route path="/users" element={<UserManagement />} />
                                <Route path="/pending-users" element={<PendingUsers />} />
                                <Route path="/settings" element={<Settings />} />
                            </>
                        )}

                        {/* Rutas compartidas entre admin y cajero */}
                        {isStaff && (
                            <>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/menu/edit/:id" element={<MenuEdit />} />
                                <Route path="/menu/new" element={<MenuEdit />} />
                                <Route path="/orders" element={<Orders />} />
                            </>
                        )}

                        {/* Rutas para usuarios regulares */}
                        {userRole === 'user' && (
                            <Route path="/orders" element={<UserOrders />} />
                        )}

                        {/* Rutas comunes para todos los roles */}
                        <Route path="/menu" element={<Menu />} />
                        <Route path="/profile" element={<Profile />} />

                        {/* Ruta por defecto para rutas no encontradas */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </>
                ) : (
                    <Route path="*" element={<Navigate to="/login" replace />} />
                )}
            </Routes>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;