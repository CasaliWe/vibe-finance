
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

function AdicionarContaButton() {
  const navigate = useNavigate();
  
  return (
    <Button 
      variant="gradient"
      className="text-white py-5 px-6 flex items-center gap-2 text-base font-medium" 
      onClick={() => navigate('/adicionar-conta')}
    >
      <PlusCircle className="w-5 h-5" />
      Adicionar Conta
    </Button>
  );
}

export default AdicionarContaButton;
