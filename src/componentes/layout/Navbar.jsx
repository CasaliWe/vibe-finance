
import { useState } from 'react';
import { useAuth } from '../../contextos/AuthContext';
import BotaoAlternarTema from '../ui/BotaoAlternarTema';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogOut, Home, LayoutDashboard, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

function Navbar() {
  const { autenticado, fazerLogout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <nav className="absolute top-[0px] w-full z-50 bg-vibe-purple shadow-md">
      <div className="container max-w-5xl mx-auto flex items-center justify-between py-4 px-4">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity text-white">
            <span className="text-2xl">✨</span>
            VibeFinance
          </Link>
        </div>
        
        {isMobile ? (
          <div className="flex items-center gap-3">
            <BotaoAlternarTema />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu} 
              className="text-white hover:bg-white/20"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {autenticado ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" className="h-10 px-4 py-2 text-white hover:bg-white/20 flex items-center gap-2">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <Link to="/perfil">
                  <Button variant="ghost" className="h-10 px-4 py-2 text-white hover:bg-white/20 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span>Perfil</span>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="h-10 px-4 py-2 text-white hover:bg-white/20 flex items-center gap-2" 
                  onClick={fazerLogout}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sair</span>
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20">
                  <User className="h-4 w-4" />
                  Entrar
                </Button>
              </Link>
            )}
            <BotaoAlternarTema />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <div className="container max-w-5xl mx-auto animate-fade-in bg-vibe-purple shadow-inner">
          <div className="flex flex-col py-3 px-4 space-y-2">
            {autenticado ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start h-12 px-4 py-2 text-white hover:bg-white/20 flex items-center gap-3">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <Link to="/perfil" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start h-12 px-4 py-2 text-white hover:bg-white/20 flex items-center gap-3">
                    <User className="h-5 w-5" />
                    <span>Perfil</span>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start h-12 px-4 py-2 text-white hover:bg-white/20 flex items-center gap-3" 
                  onClick={() => {
                    fazerLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sair</span>
                </Button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-start flex items-center gap-3 px-4 py-2 h-12 bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20">
                  <User className="h-5 w-5" />
                  Entrar
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
