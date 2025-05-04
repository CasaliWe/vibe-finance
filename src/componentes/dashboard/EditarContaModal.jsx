import React, { useState, useEffect } from 'react';
import { useContas } from '../../contextos/ContasContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from '@/components/ui/sheet';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Save, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

function EditarContaModal({ conta, isOpen, onOpenChange }) {
  const { atualizarConta } = useContas();
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [dataVencimento, setDataVencimento] = useState(new Date());
  const [totalParcelas, setTotalParcelas] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Inicializar os campos com os valores da conta atual quando o modal abrir
  useEffect(() => {
    if (conta && isOpen) {
      setNome(conta.nome || '');
      setValor(conta.valor ? conta.valor.toString() : '');
      setDataVencimento(new Date(conta.dataVencimento) || new Date());
      setTotalParcelas(conta.totalParcelas ? conta.totalParcelas.toString() : '');
    }
  }, [conta, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nome || !valor) {
      toast.error('Preencha todos os campos obrigatórios.', { duration: 4000 });
      return;
    }
    
    if (conta.tipo === 'parcelado' && (!totalParcelas || parseInt(totalParcelas) < parseInt(conta.parcelaAtual))) {
      toast.error('O número de parcelas não pode ser menor que a parcela atual.', { duration: 4000 });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const dadosAtualizados = {
        nome,
        valor: parseFloat(valor),
        dataVencimento: new Date(dataVencimento)
      };
      
      // Adicionar totalParcelas apenas se for uma conta parcelada
      if (conta.tipo === 'parcelado') {
        dadosAtualizados.totalParcelas = parseInt(totalParcelas);
      }
      
      // Identificar o ID original da conta se for uma recorrência ou parcela
      let idOriginal = conta.id;
      if (conta.id.includes('-recorrente-')) {
        idOriginal = conta.id.split('-recorrente-')[0];
      } else if (conta.id.includes('-parcela-')) {
        idOriginal = conta.id.split('-parcela-')[0];
      }
      
      await atualizarConta(idOriginal, dadosAtualizados);
      
      toast.success('Conta atualizada com sucesso!', { duration: 4000 });
      onOpenChange(false); // Fechar o modal
    } catch (erro) {
      console.error('Erro ao atualizar conta:', erro);
      toast.error('Erro ao atualizar conta. Tente novamente.', { duration: 4000 });
    } finally {
      setIsLoading(false);
    }
  };

  const formatarValor = (e) => {
    const value = e.target.value;
    // Remover caracteres não numéricos e não pontos
    const numeroLimpo = value.replace(/[^\d.]/g, '');
    
    // Garantir que há apenas um ponto decimal
    const partes = numeroLimpo.split('.');
    if (partes.length > 2) {
      setValor(partes[0] + '.' + partes.slice(1).join(''));
    } else {
      setValor(numeroLimpo);
    }
  };

  // Renderizar título apropriado para cada tipo de conta
  const renderTitulo = () => {
    if (!conta) return 'Editar Conta';
    
    if (conta.tipo === 'fixo') {
      return 'Editar Conta Fixa';
    } else if (conta.tipo === 'unica') {
      return 'Editar Conta Única';
    } else if (conta.tipo === 'parcelado') {
      return `Editar Conta Parcelada (${conta.parcelaAtual}/${conta.totalParcelas})`;
    }
    
    return 'Editar Conta';
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[500px]">
        <SheetHeader>
          <SheetTitle className="text-xl bg-gradient-to-r from-vibe-purple to-vibe-purple-light bg-clip-text text-transparent">
            {renderTitulo()}
          </SheetTitle>
          <SheetDescription>
            Edite os detalhes da conta abaixo. Apenas os campos permitidos para este tipo de conta podem ser alterados.
          </SheetDescription>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="nome-edit" className="text-base">Nome da conta</Label>
            <Input
              id="nome-edit"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Netflix, Aluguel, etc."
              className="w-full p-2"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="valor-edit" className="text-base">Valor (R$)</Label>
            <Input
              id="valor-edit"
              type="text"
              value={valor}
              onChange={formatarValor}
              placeholder="0.00"
              className="w-full p-2"
            />
          </div>
          
          {/* Mostrar o campo de parcelas apenas para contas parceladas */}
          {conta && conta.tipo === 'parcelado' && (
            <div className="space-y-2">
              <Label htmlFor="parcelas-edit" className="text-base">Número de parcelas</Label>
              <Input
                id="parcelas-edit"
                type="number"
                min={conta.parcelaAtual}
                value={totalParcelas}
                onChange={(e) => setTotalParcelas(e.target.value)}
                className="w-full p-2"
              />
              <p className="text-xs text-muted-foreground">
                Nota: Você só pode aumentar o número de parcelas, não diminuir.
              </p>
            </div>
          )}
          
          {/* Data de vencimento apenas para contas únicas */}
          {conta && conta.tipo === 'unica' && !conta.id.includes('-parcela-') && !conta.id.includes('-recorrente-') && (
            <div className="space-y-2">
              <Label htmlFor="data-edit" className="text-base">Data de vencimento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="data-edit"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border border-input bg-transparent h-10 px-3 py-2 flex items-center",
                      !dataVencimento && "text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate text-sm">
                        {dataVencimento ? (
                          format(dataVencimento, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                        ) : (
                          "Selecione uma data"
                        )}
                      </span>
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background border border-input" align="start">
                  <div className="p-3 min-w-[300px]">
                    <div className="flex justify-between items-center mb-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 bg-transparent p-0"
                        onClick={() => {
                          const prevMonth = new Date(dataVencimento);
                          prevMonth.setMonth(prevMonth.getMonth() - 1);
                          setDataVencimento(prevMonth);
                        }}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      <span className="text-sm font-medium">
                        {format(dataVencimento, "MMMM yyyy", { locale: ptBR })}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 bg-transparent p-0"
                        onClick={() => {
                          const nextMonth = new Date(dataVencimento);
                          nextMonth.setMonth(nextMonth.getMonth() + 1);
                          setDataVencimento(nextMonth);
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Calendar
                      mode="single"
                      selected={dataVencimento}
                      month={dataVencimento}
                      onSelect={(date) => date && setDataVencimento(date)}
                      initialFocus
                      locale={ptBR}
                      className="pointer-events-auto bg-background rounded-md"
                      classNames={{
                        caption: "hidden",
                      }}
                      fromMonth={new Date(2000, 0)}
                      toMonth={new Date(2100, 11)}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
          
          <SheetFooter className="pt-4">
            <Button type="submit" variant="gradient" className="w-full py-5 flex items-center justify-center gap-2" disabled={isLoading}>
              <Save className="h-4 w-4" />
              <span>Salvar Alterações</span>
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default EditarContaModal;