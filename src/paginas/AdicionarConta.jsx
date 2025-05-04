import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContas } from '../contextos/ContasContext';
import Navbar from '../componentes/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, ArrowLeft, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

function AdicionarConta() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [dataVencimento, setDataVencimento] = useState(new Date());
  const [tipo, setTipo] = useState('');
  const [totalParcelas, setTotalParcelas] = useState('');
  const { adicionarConta } = useContas();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nome || !valor || !dataVencimento || !tipo) {
      toast.error('Preencha todos os campos obrigatórios.', { duration: 4000 });
      return;
    }
    
    if (tipo === 'parcelado' && !totalParcelas) {
      toast.error('Defina o número de parcelas.', { duration: 4000 });
      return;
    }
    
    try {
      const novaConta = {
        nome,
        valor: parseFloat(valor),
        dataVencimento,
        tipo,
        totalParcelas: tipo === 'parcelado' ? parseInt(totalParcelas) : null
      };
      
      const resultado = await adicionarConta(novaConta);
      if (resultado) {
        toast.success('Conta adicionada com sucesso!', { duration: 4000 });
        navigate('/dashboard');
      }
    } catch (erro) {
      console.error('Erro ao adicionar conta:', erro);
      toast.error('Erro ao adicionar conta. Tente novamente.', { duration: 4000 });
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="container max-w-2xl px-4 py-8 flex-1 mt-16">
        <div className="mb-6 animate-fade-in">
          <Button 
            variant="ghost" 
            className="mb-4 flex items-center gap-2 font-normal hover:bg-secondary"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" /> 
            <span>Voltar para o Dashboard</span>
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-vibe-purple to-vibe-purple-light bg-clip-text text-transparent">
            Adicionar Nova Conta
          </h1>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm p-8 border border-border hover:shadow-md transition-all">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="nome" className="text-base">Nome da conta</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Netflix, Aluguel, etc."
                className="w-full p-2"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="valor" className="text-base">Valor (R$)</Label>
              <Input
                id="valor"
                type="text"
                value={valor}
                onChange={formatarValor}
                placeholder="0.00"
                className="w-full p-2"
              />
            </div>
            
            <div className="space-y-3">
              <Label className="text-base">Tipo de conta</Label>
              <RadioGroup value={tipo} onValueChange={setTipo} className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <div className={`flex items-center border rounded-md p-2 sm:p-3 cursor-pointer transition-colors ${tipo === 'fixo' ? 'border-vibe-purple bg-vibe-purple/5' : 'border-input hover:bg-secondary/50'}`}>
                  <RadioGroupItem value="fixo" id="fixo" className="z-10 mr-2 hidden sm:inline-flex" />
                  <Label htmlFor="fixo" className={`cursor-pointer w-full text-center sm:text-left ${tipo === 'fixo' ? 'font-medium text-vibe-purple' : ''}`}>
                    Fixa (Recorrente)
                  </Label>
                </div>
                <div className={`flex items-center border rounded-md p-2 sm:p-3 cursor-pointer transition-colors ${tipo === 'unica' ? 'border-vibe-purple bg-vibe-purple/5' : 'border-input hover:bg-secondary/50'}`}>
                  <RadioGroupItem value="unica" id="unica" className="z-10 mr-2 hidden sm:inline-flex" />
                  <Label htmlFor="unica" className={`cursor-pointer w-full text-center sm:text-left ${tipo === 'unica' ? 'font-medium text-vibe-purple' : ''}`}>
                    Única (Uma vez)
                  </Label>
                </div>
                <div className={`flex items-center border rounded-md p-2 sm:p-3 cursor-pointer transition-colors ${tipo === 'parcelado' ? 'border-vibe-purple bg-vibe-purple/5' : 'border-input hover:bg-secondary/50'}`}>
                  <RadioGroupItem value="parcelado" id="parcelado" className="z-10 mr-2 hidden sm:inline-flex" />
                  <Label htmlFor="parcelado" className={`cursor-pointer w-full text-center sm:text-left ${tipo === 'parcelado' ? 'font-medium text-vibe-purple' : ''}`}>
                    Parcelada
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {tipo === 'parcelado' && (
              <div className="space-y-3 animate-fade-in">
                <Label htmlFor="parcelas" className="text-base">Número de parcelas</Label>
                <Input
                  id="parcelas"
                  type="number"
                  min="2"
                  value={totalParcelas}
                  onChange={(e) => setTotalParcelas(e.target.value)}
                  className="w-full p-2"
                />
              </div>
            )}
            
            <div className="space-y-3">
              <Label htmlFor="data" className="text-base">Data de vencimento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="data"
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
                    {/* Estado para controlar o mês atualmente exibido */}
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
                    
                    {/* Calendário que usa o mês de exibição atual */}
                    <Calendar
                      mode="single"
                      selected={dataVencimento}
                      month={dataVencimento}
                      onSelect={(date) => date && setDataVencimento(date)}
                      initialFocus
                      locale={ptBR}
                      className="pointer-events-auto bg-background rounded-md"
                      classNames={{
                        caption: "hidden", // Escondemos o caption padrão já que criamos um personalizado
                      }}
                      fromMonth={new Date(2000, 0)} // Permitir seleção desde 2000
                      toMonth={new Date(2100, 11)} // Permitir seleção até 2100
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <Button type="submit" variant="gradient" className="w-full py-6 mt-4 flex items-center justify-center gap-2">
              <Save className="h-5 w-5" />
              <span>Adicionar Conta</span>
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AdicionarConta;
