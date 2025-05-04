import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contextos/AuthContext';
import Navbar from '../componentes/layout/Navbar';
import { ChevronRight, Calendar, PiggyBank, BarChart, ArrowRight, CheckCircle, CreditCard, BarChart2 } from 'lucide-react';
function Inicio() {
  const {
    autenticado
  } = useAuth();
  return <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col mt-16">
        <section className="py-20 px-4 bg-gradient-to-b from-secondary/50 to-background relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/lovable-uploads/6382027c-be74-4009-95b9-c95f3ea4c895.png')] bg-cover bg-center opacity-10" />
          <div className="container max-w-5xl mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="animate-fade-in text-center md:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-vibe-purple to-vibe-purple-light bg-clip-text text-transparent">
                    VibeFinance
                  </span>
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-foreground/80">
                  Gerencie suas finanças com o inovador "Modo Sexta", 
                  organizando suas contas semanalmente para um controle financeiro mais eficiente.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 mt-8">
                  {autenticado ? <Link to="/dashboard">
                      <Button size="lg" variant="gradient" className="text-base px-8 py-6 w-full sm:w-auto flex items-center gap-2 group">
                        Ir para o Dashboard
                        <ArrowRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link> : <>
                      <Link to="/registro">
                        <Button size="lg" variant="gradient" className="text-base px-8 py-6 w-full sm:w-auto flex items-center gap-2 group">
                          Começar Grátis
                          <ChevronRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      <Link to="/login">
                        <Button size="lg" variant="outline" className="text-base px-8 w-full sm:w-auto py-[5px]">
                          Entrar
                        </Button>
                      </Link>
                    </>}
                </div>
              </div>
              
              <div className="hidden md:flex justify-center">
                <div className="w-full max-w-md bg-card rounded-xl shadow-lg border border-border p-6 rotate-3 animate-fade-in">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-border pb-3">
                      <h3 className="font-semibold text-lg">Semana atual</h3>
                      <span className="text-sm text-vibe-purple">Saldo: R$ 1.250,00</span>
                    </div>
                    
                    {[{
                    nome: "Netflix",
                    valor: "R$ 55,90",
                    pago: true
                  }, {
                    nome: "Aluguel",
                    valor: "R$ 1.200,00",
                    pago: false
                  }, {
                    nome: "Internet",
                    valor: "R$ 120,00",
                    pago: true
                  }].map((conta, i) => <div key={i} className="flex justify-between items-center p-3 bg-background rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`h-3 w-3 rounded-full ${conta.pago ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                          <span>{conta.nome}</span>
                        </div>
                        <span className="font-medium">{conta.valor}</span>
                      </div>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Novo - Seção de Destaques */}
        <section className="py-16 px-4 bg-gradient-to-t from-secondary/30 to-background">
          <div className="container max-w-5xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-vibe-purple to-vibe-purple-light bg-clip-text text-transparent inline-block">
                Simplificando suas finanças
              </h2>
              <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
                VibeFinance transforma o modo como você organiza suas contas e mantém o controle de seu dinheiro.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card rounded-xl p-8 shadow-sm border border-border hover:shadow-md transition-all animate-fade-in" style={{
              animationDelay: "100ms"
            }}>
                <div className="flex justify-center mb-6">
                  <div className="bg-vibe-purple/10 p-4 rounded-full">
                    <Calendar className="h-10 w-10 text-vibe-purple" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center">Modo Sexta</h3>
                <p className="text-muted-foreground text-center">
                  Organize suas contas por sexta-feira, facilitando o planejamento semanal de gastos.
                </p>
                <ul className="mt-6 space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Visualização por semana</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Priorize contas urgentes</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-card rounded-xl p-8 shadow-sm border border-border hover:shadow-md transition-all animate-fade-in" style={{
              animationDelay: "200ms"
            }}>
                <div className="flex justify-center mb-6">
                  <div className="bg-vibe-purple/10 p-4 rounded-full">
                    <PiggyBank className="h-10 w-10 text-vibe-purple" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center">Controle de Renda</h3>
                <p className="text-muted-foreground text-center">
                  Cadastre suas fontes de renda e visualize quanto pode gastar por semana.
                </p>
                <ul className="mt-6 space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Múltiplas fontes de renda</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Cálculo automático de saldo</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-card rounded-xl p-8 shadow-sm border border-border hover:shadow-md transition-all animate-fade-in" style={{
              animationDelay: "300ms"
            }}>
                <div className="flex justify-center mb-6">
                  <div className="bg-vibe-purple/10 p-4 rounded-full">
                    <BarChart className="h-10 w-10 text-vibe-purple" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center">Visão Clara</h3>
                <p className="text-muted-foreground text-center">
                  Tenha uma visão completa das suas finanças com resumos e estatísticas simples.
                </p>
                <ul className="mt-6 space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Gráficos intuitivos</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Resumo de gastos mensais</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Novo - Seção Como Funciona */}
        <section className="py-16 px-4 bg-card border-y border-border">
          <div className="container max-w-5xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-vibe-purple to-vibe-purple-light bg-clip-text text-transparent inline-block">
                Como funciona
              </h2>
              <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
                Três passos simples para um controle financeiro mais eficiente
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10 relative">
              <div className="hidden md:block absolute top-1/4 left-1/3 right-1/3 h-[2px] bg-vibe-purple/20 z-0"></div>
              
              <div className="relative z-10 animate-fade-in" style={{
              animationDelay: "100ms"
            }}>
                <div className="bg-background rounded-xl p-6 shadow-sm border border-border flex flex-col items-center">
                  <div className="bg-vibe-purple/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-xl font-bold text-vibe-purple">
                    1
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-center">Cadastre suas Contas</h3>
                  <p className="text-muted-foreground text-center text-sm">
                    Adicione todas as suas contas fixas, únicas ou parceladas no sistema.
                  </p>
                  <div className="mt-4 flex justify-center">
                    <CreditCard className="h-12 w-12 text-vibe-purple" />
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 animate-fade-in" style={{
              animationDelay: "200ms"
            }}>
                <div className="bg-background rounded-xl p-6 shadow-sm border border-border flex flex-col items-center">
                  <div className="bg-vibe-purple/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-xl font-bold text-vibe-purple">
                    2
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-center">Registre sua Renda</h3>
                  <p className="text-muted-foreground text-center text-sm">
                    Informe suas fontes de renda e quando recebe cada valor.
                  </p>
                  <div className="mt-4 flex justify-center">
                    <PiggyBank className="h-12 w-12 text-vibe-purple" />
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 animate-fade-in" style={{
              animationDelay: "300ms"
            }}>
                <div className="bg-background rounded-xl p-6 shadow-sm border border-border flex flex-col items-center">
                  <div className="bg-vibe-purple/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-xl font-bold text-vibe-purple">
                    3
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-center">Acompanhe suas Finanças</h3>
                  <p className="text-muted-foreground text-center text-sm">
                    Visualize relatórios e mantenha o controle dos seus gastos.
                  </p>
                  <div className="mt-4 flex justify-center">
                    <BarChart2 className="h-12 w-12 text-vibe-purple" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              {!autenticado && <Link to="/registro">
                  <Button variant="gradient" size="lg" className="text-base group py-[5px] text-center px-[24px]">
                    <span className="mx-0 px-0 text-base font-normal">Comece agora mesmo</span>
                    
                  </Button>
                </Link>}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-card border-t border-border py-8">
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center justify-center md:justify-start">
              <span className="text-2xl">✨</span>
              <span className="ml-2 text-lg font-bold">VibeFinance</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Início</Link>
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Entrar</Link>
              <Link to="/registro" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Registre-se</Link>
            </div>
            
            <div className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} VibeFinance. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>;
}
export default Inicio;