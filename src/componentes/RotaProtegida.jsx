
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contextos/AuthContext';

function RotaProtegida({ children }) {
  const { autenticado, carregando } = useAuth();
  
  // Se estiver carregando, mostramos uma mensagem de carregamento
  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
        <p className="text-xl animate-pulse">Carregando...</p>
      </div>
    );
  }
  
  // Se não estiver autenticado, redirecionamos para a página de login
  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }
  
  // Se estiver autenticado, renderizamos o conteúdo protegido
  return children;
}

export default RotaProtegida;
