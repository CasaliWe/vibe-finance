import { useContas } from '../../contextos/ContasContext';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Search } from 'lucide-react';

function Filtros() {
  const { filtroTipo, setFiltroTipo, termoBusca, setTermoBusca } = useContas();
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar contas..."
          className="pl-10 py-2"
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
        />
      </div>
      
      <div className="bg-card border border-border p-3 rounded-md">
        <p className="text-sm font-medium mb-2">Tipo de conta:</p>
        <RadioGroup 
          value={filtroTipo} 
          onValueChange={setFiltroTipo}
          className="flex flex-wrap gap-2"
        >
          <div className={`flex items-center rounded-md py-1 px-3 cursor-pointer ${filtroTipo === 'todos' ? 'bg-vibe-purple/10 text-vibe-purple font-medium' : 'hover:bg-secondary/50'}`}>
            <RadioGroupItem value="todos" id="todos-filter" className="z-10 mr-2 hidden sm:inline-flex" />
            <Label htmlFor="todos-filter" className="text-sm cursor-pointer">Todos</Label>
          </div>
          <div className={`flex items-center rounded-md py-1 px-3 cursor-pointer ${filtroTipo === 'fixo' ? 'bg-vibe-purple/10 text-vibe-purple font-medium' : 'hover:bg-secondary/50'}`}>
            <RadioGroupItem value="fixo" id="fixo-filter" className="z-10 mr-2 hidden sm:inline-flex" />
            <Label htmlFor="fixo-filter" className="text-sm cursor-pointer">Fixas</Label>
          </div>
          <div className={`flex items-center rounded-md py-1 px-3 cursor-pointer ${filtroTipo === 'unica' ? 'bg-vibe-purple/10 text-vibe-purple font-medium' : 'hover:bg-secondary/50'}`}>
            <RadioGroupItem value="unica" id="unica-filter" className="z-10 mr-2 hidden sm:inline-flex" />
            <Label htmlFor="unica-filter" className="text-sm cursor-pointer">Únicas</Label>
          </div>
          <div className={`flex items-center rounded-md py-1 px-3 cursor-pointer ${filtroTipo === 'parcelado' ? 'bg-vibe-purple/10 text-vibe-purple font-medium' : 'hover:bg-secondary/50'}`}>
            <RadioGroupItem value="parcelado" id="parcelado-filter" className="z-10 mr-2 hidden sm:inline-flex" />
            <Label htmlFor="parcelado-filter" className="text-sm cursor-pointer">Parceladas</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

export default Filtros;
