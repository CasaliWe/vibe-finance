import { useContas } from '../../contextos/ContasContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

function ListaRendas() {
  const { rendas, removerRenda } = useContas();
  
  const handleRemoverRenda = (id) => {
    removerRenda(id);
    toast.success('Fonte de renda removida com sucesso!', { duration: 4000 });
  };
  
  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };
  
  return (
    <Card className="gradient-card">
      <CardHeader>
        <CardTitle>Minhas Fontes de Renda</CardTitle>
      </CardHeader>
      
      <CardContent>
        {rendas.length > 0 ? (
          <div className="space-y-4">
            {rendas.map((renda) => (
              <div 
                key={renda.id}
                className="flex justify-between items-center p-3 bg-background rounded-lg border border-border"
              >
                <div>
                  <p className="font-medium">{renda.nome}</p>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <span>{formatarValor(renda.valor)}</span>
                    <span>•</span>
                    <span>
                      {renda.tipo === 'mensal' && 'Mensal'}
                      {renda.tipo === 'quinzenal' && 'Quinzenal'}
                      {renda.tipo === 'semanal' && 'Semanal'}
                    </span>
                    {/* Apenas mostrar informação de dia para rendas não semanais */}
                    {renda.tipo !== 'semanal' && (
                      <>
                        <span>•</span>
                        <span>Dia {renda.dataPagamento}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-100/50"
                  onClick={() => handleRemoverRenda(renda.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Nenhuma fonte de renda cadastrada.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ListaRendas;
