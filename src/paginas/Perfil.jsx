
import { Link } from 'react-router-dom';
import Navbar from '../componentes/layout/Navbar';
import PerfilUsuario from '../componentes/perfil/PerfilUsuario';
import FormularioRenda from '../componentes/perfil/FormularioRenda';
import ListaRendas from '../componentes/perfil/ListaRendas';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

function Perfil() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="container max-w-5xl px-4 py-8 flex-1 mt-16">
        <div className="mb-6 animate-fade-in">
          <Link to="/dashboard">
            <Button 
              variant="ghost" 
              className="mb-4 flex items-center gap-2 font-normal hover:bg-secondary"
            >
              <ArrowLeft className="h-4 w-4" /> 
              <span>Voltar para o Dashboard</span>
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-vibe-purple to-vibe-purple-light bg-clip-text text-transparent">
            Meu Perfil
          </h1>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <PerfilUsuario />
          </div>
          
          <div className="space-y-6">
            <FormularioRenda />
            <ListaRendas />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Perfil;
