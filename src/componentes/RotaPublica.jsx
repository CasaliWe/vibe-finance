
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contextos/AuthContext';

// Componente para rotas públicas que devem redirecionar usuários autenticados
function RotaPublica({ children }) {
  const { autenticado, carregando } = useAuth();
  
  // Enquanto estamos verificando se o usuário está autenticado, exibimos nada
  if (carregando) {
    return null;
  }
  
  // Se o usuário estiver autenticado, redirecionamos para o dashboard
  if (autenticado) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Se o usuário não estiver autenticado, renderizamos os filhos (a rota pública)
  return children;
}

export default RotaPublica;
