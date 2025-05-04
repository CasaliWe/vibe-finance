
import { createContext, useContext, useEffect, useState } from 'react';

// Criação do contexto de tema
const TemaContext = createContext();

// Hook personalizado para usar o contexto de tema
export const useTema = () => {
  const context = useContext(TemaContext);
  if (!context) {
    throw new Error('useTema deve ser usado dentro de um TemaProvider');
  }
  return context;
};

// Provedor do contexto de tema
export function TemaProvider({ children }) {
  // Verificar se o usuário já tinha preferência salva no localStorage
  const [tema, setTema] = useState(() => {
    const temaSalvo = localStorage.getItem('vibeFinanceTema');
    if (temaSalvo) {
      return temaSalvo;
    }
    
    // Se não tiver preferência salva, verificar preferência do sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'escuro';
    }
    
    return 'claro';
  });

  // Atualizar classe no HTML e salvar preferência no localStorage quando o tema mudar
  useEffect(() => {
    const html = document.documentElement;
    
    if (tema === 'escuro') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    localStorage.setItem('vibeFinanceTema', tema);
  }, [tema]);

  // Alternar entre temas claro e escuro
  const alternarTema = () => {
    setTema(temaAtual => (temaAtual === 'claro' ? 'escuro' : 'claro'));
  };

  // Valores a serem fornecidos pelo contexto
  const value = {
    tema,
    escuro: tema === 'escuro',
    claro: tema === 'claro',
    alternarTema
  };

  return <TemaContext.Provider value={value}>{children}</TemaContext.Provider>;
}
