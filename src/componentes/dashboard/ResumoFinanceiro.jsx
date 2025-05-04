import { useContas } from '../../contextos/ContasContext';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { startOfMonth, endOfMonth, eachWeekOfInterval, addDays } from 'date-fns';

function ResumoFinanceiro() {
  const { 
    filtrarContas, 
    calcularRendaMensal,
    calcularRendaParaData,
    modoVisualizacao,
    mesAtual,
    anoAtual,
    rendas
  } = useContas();
  
  // Obter todas as contas do mês atual
  const contas = filtrarContas();
  
  // Calcular total de despesas
  const totalDespesas = contas.reduce((acc, conta) => acc + conta.valor, 0);
  
  // Calcular valores de acordo com o modo de visualização
  let rendaTotal = 0;
  
  if (modoVisualizacao === 'sexta') {
    // Para o modo sexta, vamos usar o cálculo de renda mensal tradicional
    // mas vamos exibir também o valor total distribuído nas semanas
    rendaTotal = calcularRendaMensal();
    
    // Cálculo adicional para debug - quanto está sendo distribuído nas semanas
    const primeiroDia = new Date(anoAtual, mesAtual, 1);
    const ultimoDia = new Date(anoAtual, mesAtual + 1, 0);
    
    // Obtém o primeiro domingo de cada semana do intervalo
    const primeirosDiasDaSemana = eachWeekOfInterval(
      { start: primeiroDia, end: ultimoDia },
      { weekStartsOn: 0 } // 0 = domingo como primeiro dia da semana
    );
    
    // Converte os domingos em sextas-feiras (adiciona 5 dias a cada domingo)
    const todasSextasDomes = primeirosDiasDaSemana.map(domingo => 
      addDays(domingo, 5) // Adiciona 5 dias para chegar na sexta-feira
    );
    
    // Filtra apenas as sextas-feiras que pertencem ao mês atual
    const sextasDoMes = todasSextasDomes.filter(sexta => 
      sexta.getMonth() === mesAtual
    );
    
    // Formatar as datas no formato ISO string (YYYY-MM-DD) para usar como chaves
    const chavesDatasSexta = sextasDoMes.map(data => 
      data.toISOString().split('T')[0]
    );
    
    // Apenas para debug - exibir no console
    console.log("Sextas-feiras do mês:", chavesDatasSexta);
    
    // Calculamos a renda por distribuição nas sextas
    const rendaTotalSextas = chavesDatasSexta.reduce((total, dataSexta) => {
      const rendaDaSexta = calcularRendaParaData(dataSexta);
      console.log(`Renda para ${dataSexta}:`, rendaDaSexta);
      return total + rendaDaSexta;
    }, 0);
    
    console.log("Renda total (sextas):", rendaTotalSextas);
    console.log("Renda total (mensal):", rendaTotal);
  } else {
    // No modo mensal, usamos o cálculo de renda mensal normal
    rendaTotal = calcularRendaMensal();
  }
  
  // Calcular porcentagem de gastos
  const porcentagemGastos = rendaTotal > 0 ? Math.min(100, (totalDespesas / rendaTotal) * 100) : 0;
  
  // Formatar valores
  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };
  
  return (
    <Card className="gradient-card">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Resumo Financeiro</h2>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Renda Mensal</span>
              <span className="font-medium">{formatarValor(rendaTotal)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Despesas Mensais</span>
              <span className="font-medium">{formatarValor(totalDespesas)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Saldo</span>
              <span className={`font-medium ${rendaTotal - totalDespesas >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatarValor(rendaTotal - totalDespesas)}
              </span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Utilização da Renda</span>
              <span className="text-sm">{Math.round(porcentagemGastos)}%</span>
            </div>
            <Progress value={porcentagemGastos} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ResumoFinanceiro;
