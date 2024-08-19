import { useUser } from 'contexts/userContext';
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <p>Cargando...</p>; // Puedes mostrar un spinner u otro indicador de carga
  }

  console.log(user);
  if (!user) {
    return <Navigate to="/login" />; // Redirige a la página de inicio de sesión si no está autenticado
  }

  return <>{children}</>; // Renderiza los componentes hijos si el usuario está autenticado
};

export default AuthGuard;
