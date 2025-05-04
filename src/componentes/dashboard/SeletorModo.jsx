import { useContas } from '../../contextos/ContasContext';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarDays } from 'lucide-react';

function SeletorModo() {
  const { modoVisualizacao, setModoVisualizacao } = useContas();

  return (
    <div className="flex gap-2">
      <Button
        variant={modoVisualizacao === 'mensal' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setModoVisualizacao('mensal')}
        className={`flex items-center gap-2 px-4 py-2 ${modoVisualizacao === 'mensal' ? 'bg-vibe-purple hover:bg-vibe-purple-dark' : ''}`}
      >
        <CalendarDays className="w-4 h-4" />
        Modo Mensal
      </Button>
      
      <Button
        variant={modoVisualizacao === 'sexta' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setModoVisualizacao('sexta')}
        className={`flex items-center gap-2 px-4 py-2 ${modoVisualizacao === 'sexta' ? 'bg-vibe-purple hover:bg-vibe-purple-dark' : ''}`}
      >
        <Calendar className="w-4 h-4" />
        Modo Sexta
      </Button>
    </div>
  );
}

export default SeletorModo;
