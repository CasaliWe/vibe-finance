
import { useContas } from '../contextos/ContasContext';
import Navbar from '../componentes/layout/Navbar';
import SeletorModo from '../componentes/dashboard/SeletorModo';
import NavegacaoMes from '../componentes/dashboard/NavegacaoMes';
import Filtros from '../componentes/dashboard/Filtros';
import AdicionarContaButton from '../componentes/dashboard/AdicionarContaModal';
import ListaContasSexta from '../componentes/dashboard/ListaContasSexta';
import ListaContasMensal from '../componentes/dashboard/ListaContasMensal';
import ResumoFinanceiro from '../componentes/dashboard/ResumoFinanceiro';

function Dashboard() {
  const { modoVisualizacao, carregando } = useContas();
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="container max-w-5xl px-4 py-8 flex-1 mt-16">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-vibe-purple to-vibe-purple-light bg-clip-text text-transparent">Dashboard Financeiro</h1>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between bg-card rounded-lg p-4 shadow-sm border border-border">
                <SeletorModo />
                <NavegacaoMes />
              </div>
              
              <Filtros />
            </div>
            
            <div className="flex justify-end">
              <AdicionarContaButton />
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-card rounded-lg shadow-sm p-6 border border-border hover:shadow-md transition-all">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <span className="bg-vibe-purple/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  💰
                </span>
                {modoVisualizacao === 'sexta' ? 'Contas por Sexta-Feira' : 'Contas do Mês'}
              </h2>
              
              {carregando ? (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-vibe-purple border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                  <p className="mt-4 text-muted-foreground">Carregando contas...</p>
                </div>
              ) : (
                modoVisualizacao === 'sexta' ? <ListaContasSexta /> : <ListaContasMensal />
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <ResumoFinanceiro />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
