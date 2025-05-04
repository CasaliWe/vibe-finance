import { useState, useEffect } from 'react';

/**
 * Hook que detecta se o dispositivo atual é um dispositivo móvel
 * baseado na largura da tela
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Função para verificar o tamanho da tela
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Considerando dispositivos com menos de 768px como mobile
    };

    // Verificar na montagem inicial
    checkMobile();

    // Adicionar listener para redimensionamento
    window.addEventListener('resize', checkMobile);

    // Remover listener quando o componente for desmontado
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
}
