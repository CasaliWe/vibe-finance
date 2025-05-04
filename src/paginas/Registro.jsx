import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contextos/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
function Registro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const {
    registrarUsuario,
    fazerLoginGoogle
  } = useAuth();
  const handleSubmit = async e => {
    e.preventDefault();
    if (!nome || !email || !senha) {
      toast.error('Preencha todos os campos', {
        duration: 4000
      });
      return;
    }
    if (senha !== confirmarSenha) {
      toast.error('As senhas não coincidem', {
        duration: 4000
      });
      return;
    }
    if (senha.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres', {
        duration: 4000
      });
      return;
    }
    setCarregando(true);
    try {
      const resultado = await registrarUsuario(email, senha, nome);
      if (resultado.sucesso) {
        toast.error(resultado.mensagem, {
          duration: 4000
        });
      } else {
        toast.success('Verifique seu e-mail para continuar.', {
          duration: 4000
        });
      }
    } catch (erro) {
      console.error('Erro durante o registro:', erro);
      toast.error('Ocorreu um erro durante o registro. Tente novamente.', {
        duration: 4000
      });
    } finally {
      setCarregando(false);
    }
  };
  const handleGoogleLogin = async () => {
    try {
      await fazerLoginGoogle();
    } catch (erro) {
      console.error('Erro durante o login com Google:', erro);
      toast.error('Ocorreu um erro durante o login com Google. Tente novamente.', {
        duration: 4000
      });
    }
  };
  return <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-secondary/30 to-background">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="gradient-card border-muted card-hover overflow-hidden">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center font-bold">
              <span className="bg-gradient-to-r from-vibe-purple to-vibe-purple-light bg-clip-text text-transparent">
                Criar conta
              </span>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="nome" className="text-sm font-medium">
                  Nome
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input id="nome" value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" required className="pl-10 p-2 border-input focus:ring-2 focus:ring-vibe-purple/50 px-[45px]" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" required className="pl-10 p-2 border-input focus:ring-2 focus:ring-vibe-purple/50 px-[45px]" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="senha" className="text-sm font-medium">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input id="senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="••••••••" required className="pl-10 p-2 border-input focus:ring-2 focus:ring-vibe-purple/50 px-[45px]" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmarSenha" className="text-sm font-medium">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input id="confirmarSenha" type="password" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} placeholder="••••••••" required className="pl-10 p-2 border-input focus:ring-2 focus:ring-vibe-purple/50 px-[45px]" />
                </div>
              </div>
              
              <Button type="submit" variant="gradient" className="w-full py-6 mt-2 flex items-center justify-center gap-2" disabled={carregando}>
                {carregando ? 'Registrando...' : <>
                    <ArrowRight className="h-5 w-5" />
                    <span>Registrar</span>
                  </>}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Ou continue com
                  </span>
                </div>
              </div>

              <Button type="button" variant="outline" className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 py-6" onClick={handleGoogleLogin}>
                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                  <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                </svg>
                <span className="ml-1">Continuar com Google</span>
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 pb-6 pt-0">
            <div className="text-sm text-center mt-2">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-vibe-purple hover:text-vibe-purple-dark transition-colors font-medium">
                Entrar
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>;
}
export default Registro;