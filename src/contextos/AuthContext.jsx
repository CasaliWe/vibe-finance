
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Criação do contexto de autenticação
const AuthContext = createContext();

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provedor do contexto de autenticação
export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [session, setSession] = useState(null);

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    // Primeiro configuramos o listener de eventos de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          setUsuario({
            id: currentSession.user.id,
            email: currentSession.user.email,
            nome: currentSession.user.user_metadata?.nome || 'Usuário'
          });
          
          setCarregando(false);
        } else if (event === 'SIGNED_OUT') {
          setUsuario(null);
          setSession(null);
          setCarregando(false);
          navigate('/');
        }
      }
    );

    // Depois verificamos a sessão atual
    const verificarAutenticacao = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          setSession(currentSession);
          setUsuario({
            id: currentSession.user.id,
            email: currentSession.user.email,
            nome: currentSession.user.user_metadata?.nome || 'Usuário'
          });
        }
      } catch (erro) {
        console.error('Erro ao verificar autenticação:', erro);
      } finally {
        setCarregando(false);
      }
    };

    verificarAutenticacao();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  // Função para fazer login
  const fazerLogin = async (email, senha) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha
      });

      if (error) {
        return { 
          sucesso: false, 
          mensagem: error.message === 'Invalid login credentials'
            ? 'Credenciais inválidas. Tente novamente.'
            : error.message 
        };
      }
      
      navigate('/dashboard');
      
      return { sucesso: true };
    } catch (erro) {
      console.error('Erro ao fazer login:', erro);
      return { sucesso: false, mensagem: 'Erro ao fazer login. Tente novamente.' };
    }
  };

  // Função para login com Google
  const fazerLoginGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        toast.error(error.message);
        return { sucesso: false, mensagem: error.message };
      }
      
      return { sucesso: true };
    } catch (erro) {
      console.error('Erro ao fazer login com Google:', erro);
      return { sucesso: false, mensagem: 'Erro ao fazer login com Google. Tente novamente.' };
    }
  };

  // Função para registrar um novo usuário
  const registrarUsuario = async (email, senha, nome) => {
    try {
      // Modificado para desativar a verificação de email e fazer login direto
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: { nome },
          // Removida a opção emailRedirectTo para não exigir verificação de email
        }
      });

      if (error) {
        return { sucesso: false, mensagem: error.message };
      }
      
      // Após o registro, fazer login automático
      if (data.user) {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password: senha
        });
        
        if (loginError) {
          return { sucesso: false, mensagem: loginError.message };
        }
        
        navigate('/dashboard');
        return { sucesso: true };
      }
      
      return { 
        sucesso: true, 
        mensagem: 'Conta criada! Você será redirecionado ao dashboard.' 
      };
    } catch (erro) {
      console.error('Erro ao registrar usuário:', erro);
      return { sucesso: false, mensagem: 'Erro ao registrar usuário. Tente novamente.' };
    }
  };

  // Função para recuperar senha
  const recuperarSenha = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { sucesso: false, mensagem: error.message };
      }
      
      return { 
        sucesso: true, 
        mensagem: 'Instruções enviadas para seu email.' 
      };
    } catch (erro) {
      console.error('Erro ao recuperar senha:', erro);
      return { sucesso: false, mensagem: 'Erro ao recuperar senha. Tente novamente.' };
    }
  };

  // Função para fazer logout
  const fazerLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUsuario(null);
      setSession(null);
      navigate('/');
    } catch (erro) {
      console.error('Erro ao fazer logout:', erro);
      toast.error('Erro ao fazer logout. Tente novamente.');
    }
  };

  // Valores a serem fornecidos pelo contexto
  const value = {
    usuario,
    carregando,
    autenticado: !!session,
    fazerLogin,
    fazerLoginGoogle,
    registrarUsuario,
    recuperarSenha,
    fazerLogout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
