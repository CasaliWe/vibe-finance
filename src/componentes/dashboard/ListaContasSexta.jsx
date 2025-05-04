
import { useContas } from '../../contextos/ContasContext';
import GrupoContasSemana from './GrupoContasSemana';

function ListaContasSexta() {
  const { contasPorSemana } = useContas();
  
  const semanas = contasPorSemana();
  const datasOrdenadas = Object.keys(semanas).sort();
  
  return (
    <div>
      {datasOrdenadas.length > 0 ? (
        datasOrdenadas.map(data => (
          <GrupoContasSemana key={data} data={data} contas={semanas[data]} />
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhuma conta encontrada para este mês.</p>
        </div>
      )}
    </div>
  );
}

export default ListaContasSexta;
