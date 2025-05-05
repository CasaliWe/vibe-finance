import React, { useState, useEffect, useRef } from 'react';
import { useContas } from '../../contextos/ContasContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from 'sonner';

function FormularioRenda() {
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('');
  const [dataPagamento, setDataPagamento] = useState('');
  const [enviando, setEnviando] = useState(false);
  const somRendaRef = useRef(null);
  const { adicionarRenda } = useContas();

  // Inicialização do objeto de áudio
  useEffect(() => {
    somRendaRef.current = new Audio('/renda.mp3');
  }, []);

  // Resetar o formulário
  const resetarFormulario = () => {
    setNome('');
    setValor('');
    setTipo('');
    setDataPagamento('');
  };

  // Efeito para definir dia de pagamento como 6 (sexta-feira) quando tipo for semanal
  useEffect(() => {
    if (tipo === 'semanal') {
      setDataPagamento('6'); // 6 representa sexta-feira (0 = domingo, 6 = sábado)
    }
  }, [tipo]);

  // Formatação do valor
  const formatarValor = (e) => {
    const value = e.target.value;
    const numeroLimpo = value.replace(/[^\d.]/g, '');
    
    const partes = numeroLimpo.split('.');
    if (partes.length > 2) {
      setValor(partes[0] + '.' + partes.slice(1).join(''));
    } else {
      setValor(numeroLimpo);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nome || !valor || !tipo) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (tipo !== 'semanal' && !dataPagamento) {
      toast.error('Por favor, informe a data de recebimento.');
      return;
    }

    setEnviando(true);

    try {
      const novaRenda = {
        nome,
        valor: parseFloat(valor),
        tipo,
        dataPagamento: tipo === 'semanal' ? 6 : parseInt(dataPagamento)
      };

      const resultado = await adicionarRenda(novaRenda);
      
      if (resultado) {
        // Reproduzir o som de nova renda adicionada
        somRendaRef.current.currentTime = 0; // Reinicia o áudio caso esteja tocando
        somRendaRef.current.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
        
        toast.success('Fonte de renda adicionada com sucesso!');
        resetarFormulario();
      }
    } catch (erro) {
      console.error('Erro ao adicionar renda:', erro);
      toast.error('Erro ao adicionar fonte de renda. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-sm p-5 border border-border">
      <h2 className="text-xl font-semibold mb-4">Adicionar Nova Fonte de Renda</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo de Recebimento</Label>
          <RadioGroup 
            value={tipo} 
            onValueChange={setTipo}
            className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mt-1"
          >
            <div className={`flex items-center border rounded-md p-2 cursor-pointer transition-colors ${tipo === 'mensal' ? 'border-vibe-purple bg-vibe-purple/5' : 'border-input hover:bg-secondary/50'}`}>
              <RadioGroupItem value="mensal" id="tipo-mensal" className="z-10 mr-2" />
              <Label htmlFor="tipo-mensal" className={`cursor-pointer w-full ${tipo === 'mensal' ? 'font-medium text-vibe-purple' : ''}`}>
                Mensal
              </Label>
            </div>
            <div className={`flex items-center border rounded-md p-2 cursor-pointer transition-colors ${tipo === 'quinzenal' ? 'border-vibe-purple bg-vibe-purple/5' : 'border-input hover:bg-secondary/50'}`}>
              <RadioGroupItem value="quinzenal" id="tipo-quinzenal" className="z-10 mr-2" />
              <Label htmlFor="tipo-quinzenal" className={`cursor-pointer w-full ${tipo === 'quinzenal' ? 'font-medium text-vibe-purple' : ''}`}>
                Quinzenal
              </Label>
            </div>
            <div className={`flex items-center border rounded-md p-2 cursor-pointer transition-colors ${tipo === 'semanal' ? 'border-vibe-purple bg-vibe-purple/5' : 'border-input hover:bg-secondary/50'}`}>
              <RadioGroupItem value="semanal" id="tipo-semanal" className="z-10 mr-2" />
              <Label htmlFor="tipo-semanal" className={`cursor-pointer w-full ${tipo === 'semanal' ? 'font-medium text-vibe-purple' : ''}`}>
                Semanal
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nome">Nome da fonte</Label>
          <Input
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Salário, Freelance, etc."
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="valor">Valor (R$)</Label>
          <Input
            id="valor"
            type="text"
            value={valor}
            onChange={formatarValor}
            placeholder="0.00"
            required
          />
        </div>
        
        {tipo && tipo !== 'semanal' && (
          <div className="space-y-2">
            <Label htmlFor="data">
              {tipo === 'mensal' ? 'Dia do recebimento (1-31)' : 'Dia do recebimento (1º ou 2º quinzena)'}
            </Label>
            <Input
              id="data"
              type="number"
              min={tipo === 'mensal' ? 1 : 1}
              max={tipo === 'mensal' ? 31 : 2}
              value={dataPagamento}
              onChange={(e) => setDataPagamento(e.target.value)}
              placeholder={tipo === 'mensal' ? "Ex: 5" : "1 ou 2"}
              required
            />
          </div>
        )}
        
        <Button 
          type="submit" 
          className="w-full bg-vibe-purple hover:bg-vibe-purple-dark"
          disabled={enviando}
        >
          {enviando ? 'Adicionando...' : 'Adicionar Fonte de Renda'}
        </Button>
      </form>
    </div>
  );
}

export default FormularioRenda;
