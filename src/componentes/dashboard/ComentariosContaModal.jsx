import React, { useState, useEffect, useRef } from 'react';
import { useContas } from '../../contextos/ContasContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MessageSquare, Send, Trash2, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

function ComentariosContaModal({ conta, isOpen, onOpenChange }) {
  const { obterComentariosDaConta, adicionarComentarioNaConta, removerComentario } = useContas();
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef(null);
  const inputRef = useRef(null);

  // Carregar comentários quando a conta mudar ou o modal abrir
  useEffect(() => {
    if (conta && isOpen) {
      const comentariosDaConta = obterComentariosDaConta(conta);
      setComentarios(comentariosDaConta);
      
      // Focar no campo de entrada quando o modal abrir
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setNovoComentario('');
    }
  }, [conta, isOpen, obterComentariosDaConta]);

  // Rolar para o final quando novos comentários forem adicionados
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [comentarios]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!novoComentario.trim()) {
      toast.error('Digite um comentário antes de enviar.');
      return;
    }
    
    try {
      setIsLoading(true);
      const comentarioAdicionado = await adicionarComentarioNaConta(conta, novoComentario);
      
      if (comentarioAdicionado) {
        // Atualizar a lista de comentários local
        setComentarios(comentariosAtuais => [comentarioAdicionado, ...comentariosAtuais]);
        setNovoComentario('');
      }
    } catch (erro) {
      console.error('Erro ao adicionar comentário:', erro);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoverComentario = async (id) => {
    try {
      await removerComentario(id);
      // Atualizar a lista de comentários local
      setComentarios(comentariosAtuais => comentariosAtuais.filter(c => c.id !== id));
    } catch (erro) {
      console.error('Erro ao remover comentário:', erro);
    }
  };

  const formatarData = (data) => {
    try {
      const dataComentario = new Date(data);
      
      // Se for do mesmo dia, mostrar apenas "hoje às HH:MM"
      const hoje = new Date();
      if (dataComentario.toDateString() === hoje.toDateString()) {
        return `hoje às ${format(dataComentario, 'HH:mm')}`;
      }
      
      // Se for do dia anterior, mostrar "ontem às HH:MM"
      const ontem = new Date(hoje);
      ontem.setDate(ontem.getDate() - 1);
      if (dataComentario.toDateString() === ontem.toDateString()) {
        return `ontem às ${format(dataComentario, 'HH:mm')}`;
      }
      
      // Caso contrário, mostrar a data completa
      return format(dataComentario, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (erro) {
      return 'Data inválida';
    }
  };

  // Gerar um título para o modal baseado no tipo de conta e informações relevantes
  const renderTitulo = () => {
    if (!conta) return 'Comentários';
    
    let titulo = 'Comentários: ';
    titulo += conta.nome;
    
    if (conta.tipo === 'parcelado' && conta.parcelaAtual && conta.totalParcelas) {
      titulo += ` (${conta.parcelaAtual}/${conta.totalParcelas})`;
    }
    
    return titulo;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">
            <span className="bg-gradient-to-r from-vibe-purple to-vibe-purple-light bg-clip-text text-transparent flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-vibe-purple" />
              {renderTitulo()}
            </span>
          </DialogTitle>
          <DialogDescription>
            {conta && (
              <div className="flex flex-col">
                <span>Adicione notas ou comentários sobre esta conta.</span>
                <span className="text-sm text-muted-foreground mt-1">
                  {`Vencimento: ${format(new Date(conta.dataVencimento), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`}
                </span>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 py-4">
          <div className="border rounded-lg bg-card/50 mb-4">
            <ScrollArea className="h-[280px] p-4" ref={scrollAreaRef}>
              {comentarios.length === 0 ? (
                <div className="h-full flex items-center justify-center py-8 opacity-70">
                  <div className="text-center space-y-2">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground opacity-30" />
                    <p className="text-muted-foreground">
                      Nenhum comentário ainda. <br />
                      Adicione o primeiro comentário abaixo.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {comentarios.map(comentario => (
                    <div 
                      key={comentario.id} 
                      className="relative bg-background p-4 rounded-lg border shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="px-2 py-0.5 text-xs bg-vibe-purple/10 text-vibe-purple rounded-full font-medium">
                          {formatarData(comentario.data_comentario)}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full text-red-500 hover:text-red-700 hover:bg-red-100/50 absolute top-2 right-2"
                          onClick={() => handleRemoverComentario(comentario.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm whitespace-pre-wrap break-words leading-relaxed mt-2">{comentario.texto}</p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              ref={inputRef}
              placeholder="Digite seu comentário aqui..."
              value={novoComentario}
              onChange={(e) => setNovoComentario(e.target.value)}
              className="min-h-[100px] resize-none border-vibe-purple/20 focus-visible:ring-vibe-purple/30"
            />
            <DialogFooter>
              <Button 
                type="submit" 
                variant="gradient" 
                className="w-full py-5 flex items-center justify-center gap-2" 
                disabled={isLoading || !novoComentario.trim()}
              >
                <Send className="h-4 w-4" />
                <span>Adicionar Comentário</span>
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ComentariosContaModal;