import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contextos/AuthContext";
import { TemaProvider } from "./contextos/TemaContext";
import { ContasProvider } from "./contextos/ContasContext";
import RotaProtegida from "./componentes/RotaProtegida";
import RotaPublica from "./componentes/RotaPublica";

import Inicio from "./paginas/Inicio";
import Login from "./paginas/Login";
import Registro from "./paginas/Registro";
import RecuperarSenha from "./paginas/RecuperarSenha";
import Dashboard from "./paginas/Dashboard";
import Perfil from "./paginas/Perfil";
import NaoEncontrada from "./paginas/NaoEncontrada";
import AdicionarConta from "./paginas/AdicionarConta";

const App = () => (
  <TooltipProvider>
    <BrowserRouter>
      <TemaProvider>
        <AuthProvider>
          <ContasProvider>
            <Sonner />
            <Toaster />
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/" element={<Inicio />} />
              
              {/* Rotas que redirecionam usuários autenticados para o dashboard */}
              <Route path="/login" element={
                <RotaPublica>
                  <Login />
                </RotaPublica>
              } />
              <Route path="/registro" element={
                <RotaPublica>
                  <Registro />
                </RotaPublica>
              } />
              <Route path="/recuperar-senha" element={
                <RotaPublica>
                  <RecuperarSenha />
                </RotaPublica>
              } />
              
              {/* Rotas Protegidas (requerem autenticação) */}
              <Route path="/dashboard" element={
                <RotaProtegida>
                  <Dashboard />
                </RotaProtegida>
              } />
              <Route path="/perfil" element={
                <RotaProtegida>
                  <Perfil />
                </RotaProtegida>
              } />
              <Route path="/adicionar-conta" element={
                <RotaProtegida>
                  <AdicionarConta />
                </RotaProtegida>
              } />
              
              {/* Página 404 */}
              <Route path="*" element={<NaoEncontrada />} />
            </Routes>
          </ContasProvider>
        </AuthProvider>
      </TemaProvider>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
