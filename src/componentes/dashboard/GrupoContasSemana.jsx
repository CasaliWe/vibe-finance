import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CartaoConta from './CartaoConta';
import { useContas } from '../../contextos/ContasContext';

function GrupoContasSemana({ data, contas }) {
  const { calcularRendaParaData } = useContas();
  
  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Calcular o total das contas
  const totalContas = contas.reduce((acc, conta) => acc + conta.valor, 0);
  
  // Calcular a renda desta semana específica
  const rendaSemanal = calcularRendaParaData(data);
  
  // Calcular o saldo da semana
  const saldoSemana = rendaSemanal - totalContas;
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">
          Sexta, {format(new Date(data), "dd 'de' MMMM", { locale: ptBR })}
        </h3>
        <div className="text-lg font-medium">
          Total: {formatarValor(totalContas)}
        </div>
      </div>
      
      {/* Adicionar informação de renda e saldo da semana */}
      <div className="mb-4 p-3 rounded-md bg-card border border-border">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Renda:</span>
              <span>{formatarValor(rendaSemanal)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Despesas:</span>
              <span>{formatarValor(totalContas)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Saldo:</span>
              <span className={saldoSemana >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                {formatarValor(saldoSemana)}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {contas.length > 0 ? (
          contas.map(conta => (
            <CartaoConta key={conta.id} conta={conta} />
          ))
        ) : (
          <div className="text-center py-8 bg-card rounded-lg border border-border">
            <p className="text-muted-foreground">Sem contas nessa semana.</p>
            <p className="text-muted-foreground text-sm mt-1">Você tem {formatarValor(saldoSemana)} disponíveis para gastar.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GrupoContasSemana;
