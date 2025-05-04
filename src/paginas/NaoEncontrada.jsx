
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '../componentes/layout/Navbar';

function NaoEncontrada() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-5xl mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl md:text-9xl font-bold text-vibe-purple mb-6">404</h1>
        <h2 className="text-2xl md:text-4xl font-semibold mb-8">Página não encontrada</h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
          A página que você está procurando não existe ou foi removida.
        </p>
        
        <Link to="/">
          <Button className="btn-gradient px-4">Voltar para o início</Button>
        </Link>
      </main>
    </div>
  );
}

export default NaoEncontrada;
