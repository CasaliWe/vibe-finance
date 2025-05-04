
import { useContas } from '../../contextos/ContasContext';
import CartaoConta from './CartaoConta';

function ListaContasMensal() {
  const { filtrarContas } = useContas();
  
  const contas = filtrarContas();
  
  // Ordenar contas por data de vencimento
  const contasOrdenadas = [...contas].sort((a, b) => {
    return new Date(a.dataVencimento) - new Date(b.dataVencimento);
  });

  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Calcular o total das contas
  const totalContas = contasOrdenadas.reduce((acc, conta) => acc + conta.valor, 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="text-xl font-semibold">
          Total: {formatarValor(totalContas)}
        </div>
      </div>
      
      <div className="space-y-3">
        {contasOrdenadas.length > 0 ? (
          contasOrdenadas.map(conta => (
            <CartaoConta key={conta.id} conta={conta} />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma conta encontrada para este mês.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListaContasMensal;
