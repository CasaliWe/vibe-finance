
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contextos/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';

function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const { recuperarSenha } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Preencha seu email', { duration: 4000 });
      return;
    }
    
    setCarregando(true);
    
    try {
      const resultado = await recuperarSenha(email);
      
      if (!resultado.sucesso) {
        toast.error(resultado.mensagem, { duration: 4000 });
      } else {
        toast.success(resultado.mensagem, { duration: 4000 });
        setEnviado(true);
      }
    } catch (erro) {
      console.error('Erro durante a recuperação de senha:', erro);
      toast.error('Ocorreu um erro. Tente novamente.', { duration: 4000 });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="gradient-card border-muted card-hover">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center font-bold">Recuperar Senha</CardTitle>
          </CardHeader>
          
          <CardContent>
            {enviado ? (
              <div className="text-center space-y-4">
                <p className="text-sm">
                  As instruções para recuperação de senha foram enviadas para {email}.
                </p>
                <p className="text-sm">
                  Verifique sua caixa de entrada e siga as instruções.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="border-input focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full btn-gradient"
                  disabled={carregando}
                >
                  {carregando ? 'Enviando...' : 'Enviar Instruções'}
                </Button>
              </form>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center mt-2">
              <Link 
                to="/login" 
                className="text-vibe-purple hover:text-vibe-purple-dark font-medium"
              >
                Voltar para o login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default RecuperarSenha;
