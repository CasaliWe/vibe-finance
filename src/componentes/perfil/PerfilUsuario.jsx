import { useAuth } from '../../contextos/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

function PerfilUsuario() {
  const { usuario } = useAuth();
  const [nome, setNome] = useState(usuario?.nome || '');
  const [email] = useState(usuario?.email || '');
  const [carregando, setCarregando] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nome) {
      toast.error('O nome é obrigatório.', { duration: 4000 });
      return;
    }
    
    setCarregando(true);
    
    try {
      // Atualizar os metadata do usuário no Supabase
      const { error } = await supabase.auth.updateUser({
        data: { nome: nome }
      });
      
      if (error) {
        throw error;
      }
      
      // Atualizar o perfil na tabela perfis (se existir)
      const { error: perfilError } = await supabase
        .from('perfis')
        .update({ nome: nome })
        .eq('id', usuario.id);
      
      if (perfilError) {
        console.warn('Aviso ao atualizar tabela de perfis:', perfilError);
        // Não vamos lançar um erro aqui, pois a atualização principal já foi feita
      }
      
      toast.success('Perfil atualizado com sucesso!', { duration: 4000 });
    } catch (erro) {
      console.error('Erro ao atualizar perfil:', erro);
      toast.error('Erro ao atualizar perfil. Tente novamente.', { duration: 4000 });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Card className="gradient-card">
      <CardContent className="pt-6">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-vibe-purple/10 p-4 rounded-full">
            <User className="h-16 w-16 text-vibe-purple" />
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="nome-perfil" className="text-sm font-medium">Nome</label>
            <Input
              id="nome-perfil"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email-perfil" className="text-sm font-medium">Email</label>
            <Input
              id="email-perfil"
              type="email"
              value={email}
              disabled
              className="bg-muted/50"
            />
            <p className="text-xs text-muted-foreground">O email não pode ser alterado.</p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full btn-gradient"
            disabled={carregando}
          >
            {carregando ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default PerfilUsuario;
