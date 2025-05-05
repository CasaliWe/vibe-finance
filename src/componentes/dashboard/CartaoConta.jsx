import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2, CheckCircle2, Circle, Pencil, MessageSquare } from 'lucide-react';
import { useContas } from '../../contextos/ContasContext';
import { toast } from 'sonner';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import EditarContaModal from './EditarContaModal';
import ComentariosContaModal from './ComentariosContaModal';
import { useIsMobile } from '../../hooks/use-mobile';

function CartaoConta({ conta }) {
  const { removerConta, verificarContaPaga, alternarPagamentoConta, obterComentariosDaConta } = useContas();
  const [estaPaga, setEstaPaga] = useState(false);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [modalComentariosAberto, setModalComentariosAberto] = useState(false);
  const [possuiComentarios, setPossuiComentarios] = useState(false);
  const somPagoRef = useRef(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Verificar o status de pagamento da conta quando o componente é montado ou quando a conta muda
    setEstaPaga(verificarContaPaga(conta, conta.dataVencimento.getMonth(), conta.dataVencimento.getFullYear()));
    
    // Verificar se a conta possui comentários
    const comentarios = obterComentariosDaConta(conta);
    setPossuiComentarios(comentarios.length > 0);
    
    // Inicializar o objeto de áudio
    somPagoRef.current = new Audio('/pago.mp3');
  }, [conta, verificarContaPaga, obterComentariosDaConta]);
  
  const handleRemover = () => {
    removerConta(conta.id);
    toast.success('Conta removida com sucesso!', { duration: 4000 });
  };
  
  const handleAlternarPagamento = () => {
    alternarPagamentoConta(conta);
    const novoEstado = !estaPaga;
    setEstaPaga(novoEstado);
    
    // Se está marcando como paga, reproduz o som
    if (novoEstado) {
      somPagoRef.current.currentTime = 0; // Reinicia o áudio caso esteja tocando
      somPagoRef.current.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
    }
  };

  const handleEditar = () => {
    setModalEditarAberto(true);
  };

  const handleAbrirComentarios = () => {
    setModalComentariosAberto(true);
  };
  
  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };
  
  const renderBadgeTipoConta = () => {
    if (conta.tipo === 'fixo') {
      return <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full">Fixa</span>;
    } else if (conta.tipo === 'unica') {
      return <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full">Única</span>;
    } else if (conta.tipo === 'parcelado') {
      return <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
        {conta.parcelaAtual}/{conta.totalParcelas}
      </span>;
    }
    return null;
  };

  return (
    <>
      <Card 
        className={cn(
          "gradient-card card-hover transition-all duration-200", 
          estaPaga ? "opacity-70 bg-opacity-50 border-green-200 dark:border-green-900" : ""
        )}
        onClick={handleAbrirComentarios}
      >
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "h-6 w-6 p-0 rounded-full transition-colors", 
                    estaPaga ? "text-green-600 hover:text-green-700 hover:bg-green-100/50" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAlternarPagamento();
                  }}
                >
                  {estaPaga ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                </Button>
                <h3 className={cn(
                  "font-medium text-lg transition-all cursor-pointer", 
                  estaPaga ? "line-through text-muted-foreground" : ""
                )}>
                  {conta.nome}
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 ml-8">
                {renderBadgeTipoConta()}
                
                {/* Exibir a data de vencimento apenas em desktop ou em mobile de forma reduzida */}
                {!isMobile ? (
                  <span className="text-sm text-muted-foreground">
                    Vence em {format(new Date(conta.dataVencimento), "dd/MM", { locale: ptBR })}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(conta.dataVencimento), "dd/MM", { locale: ptBR })}
                  </span>
                )}
                
                {/* Indicador de comentários visível apenas no desktop */}
                {possuiComentarios && !isMobile && (
                  <span className="flex items-center text-xs text-vibe-purple">
                    <MessageSquare className="h-3 w-3 mr-1" /> Com comentários
                  </span>
                )}

                {/* Indicador de comentários no mobile, só o ícone */}
                {possuiComentarios && isMobile && (
                  <MessageSquare className="h-3 w-3 text-vibe-purple" />
                )}
              </div>
            </div>
            <div className="text-right">
              <p className={cn(
                isMobile ? "font-semibold text-base transition-all" : "font-semibold text-xl transition-all", 
                estaPaga ? "text-green-600 dark:text-green-400" : ""
              )}>
                {formatarValor(conta.valor)}
              </p>
              <div className="flex gap-1 justify-end">
                {/* Botões menores no mobile */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={isMobile ? "h-7 w-7 text-vibe-purple" : "h-8 w-8 text-vibe-purple hover:text-vibe-purple-dark hover:bg-vibe-purple/10"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAbrirComentarios();
                  }}
                >
                  <MessageSquare className={isMobile ? "h-3.5 w-3.5" : "h-4 w-4"} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={isMobile ? "h-7 w-7 text-vibe-purple" : "h-8 w-8 text-vibe-purple hover:text-vibe-purple-dark hover:bg-vibe-purple/10"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditar();
                  }}
                >
                  <Pencil className={isMobile ? "h-3.5 w-3.5" : "h-4 w-4"} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={isMobile ? "h-7 w-7 text-red-500" : "h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100/50"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemover();
                  }}
                >
                  <Trash2 className={isMobile ? "h-3.5 w-3.5" : "h-4 w-4"} />
                </Button>
              </div>
            </div>
          </div>
          {estaPaga && (
            <div className="mt-2 text-xs text-green-600 dark:text-green-400 text-center font-medium">
              Pago
            </div>
          )}
        </div>
      </Card>

      {/* Modal de edição */}
      <EditarContaModal 
        conta={conta}
        isOpen={modalEditarAberto}
        onOpenChange={setModalEditarAberto}
      />

      {/* Modal de comentários */}
      <ComentariosContaModal 
        conta={conta}
        isOpen={modalComentariosAberto}
        onOpenChange={setModalComentariosAberto}
      />
    </>
  );
}

export default CartaoConta;
