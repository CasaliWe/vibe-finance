
import { useContas } from '../../contextos/ContasContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function NavegacaoMes() {
  const { mesAtual, anoAtual, irParaMesAnterior, irParaProximoMes } = useContas();
  
  // Nomes dos meses em português
  const nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  return (
    <div className="flex items-center space-x-3">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={irParaMesAnterior}
        className="h-9 w-9 flex items-center justify-center rounded-md"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <h2 className="text-lg font-medium px-2">
        {nomesMeses[mesAtual]} {anoAtual}
      </h2>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={irParaProximoMes}
        className="h-9 w-9 flex items-center justify-center rounded-md"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}

export default NavegacaoMes;
