import { useTema } from '../../contextos/TemaContext';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Componente para alternar entre tema claro e escuro
function BotaoAlternarTema() {
  const {
    escuro,
    alternarTema
  } = useTema();
  return <Button variant="ghost" size="icon" onClick={alternarTema} aria-label={escuro ? 'Mudar para tema claro' : 'Mudar para tema escuro'} className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all px-[10px]">
      {escuro ? <Sun className="h-5 w-5 transition-transform hover:rotate-45" /> : <Moon className="h-5 w-5 transition-transform hover:rotate-12" />}
    </Button>;
}
export default BotaoAlternarTema;