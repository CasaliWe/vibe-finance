import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { addMonths, format } from 'date-fns';

// Criação do contexto de contas
const ContasContext = createContext();

// Hook personalizado para usar o contexto de contas
export const useContas = () => {
  const context = useContext(ContasContext);
  if (!context) {
    throw new Error('useContas deve ser usado dentro de um ContasProvider');
  }
  return context;
};

// Provedor do contexto de contas
export function ContasProvider({ children }) {
  const { usuario, autenticado } = useAuth();
  const [contas, setContas] = useState([]);
  const [rendas, setRendas] = useState([]);
  const [pagamentosContas, setPagamentosContas] = useState([]);
  const [comentariosContas, setComentariosContas] = useState([]);
  const [modoVisualizacao, setModoVisualizacao] = useState('sexta'); // 'sexta' ou 'mensal'
  const [filtroTipo, setFiltroTipo] = useState('todos'); // 'todos', 'fixo', 'unica', 'parcelado'
  const [termoBusca, setTermoBusca] = useState('');
  const [mesAtual, setMesAtual] = useState(new Date().getMonth());
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear());
  const [carregando, setCarregando] = useState(true);

  // Carregar dados do usuário quando autenticado
  useEffect(() => {
    const carregarDados = async () => {
      if (!autenticado || !usuario) {
        setContas([]);
        setRendas([]);
        setPagamentosContas([]);
        setComentariosContas([]);
        setCarregando(false);
        return;
      }

      setCarregando(true);
      try {
        // Carregar contas do usuário
        const { data: contasData, error: contasError } = await supabase
          .from('contas')
          .select('*')
          .eq('usuario_id', usuario.id)
          .order('data_vencimento', { ascending: true });

        if (contasError) throw contasError;

        // Carregar pagamentos de contas do usuário
        const { data: pagamentosData, error: pagamentosError } = await supabase
          .from('pagamentos_contas')
          .select('*')
          .eq('usuario_id', usuario.id);

        if (pagamentosError) throw pagamentosError;
        
        setPagamentosContas(pagamentosData);

        // Carregar comentários de contas do usuário
        const { data: comentariosData, error: comentariosError } = await supabase
          .from('comentarios_contas')
          .select('*')
          .eq('usuario_id', usuario.id);

        if (comentariosError) throw comentariosError;
        
        setComentariosContas(comentariosData);

        // Transformar contas parceladas em múltiplas instâncias para meses futuros
        let todasAsContas = [];

        for (let conta of contasData) {
          // Formatação da conta atual
          const contaFormatada = {
            id: conta.id,
            nome: conta.nome,
            valor: parseFloat(conta.valor),
            dataVencimento: new Date(conta.data_vencimento),
            tipo: conta.tipo,
            parcelaAtual: conta.parcela_atual || 1,
            totalParcelas: conta.total_parcelas,
            pago: conta.pago
          };
          
          todasAsContas.push(contaFormatada);
          
          // Gerar instâncias futuras para contas parceladas
          if (conta.tipo === 'parcelado' && conta.total_parcelas > 1) {
            // Começar da segunda parcela, pois a primeira já foi adicionada
            for (let i = 1; i < conta.total_parcelas; i++) {
              const dataProximaParcela = addMonths(new Date(conta.data_vencimento), i);
              
              const proximaParcela = {
                id: `${conta.id}-parcela-${i+1}`,
                nome: conta.nome,
                valor: parseFloat(conta.valor),
                dataVencimento: dataProximaParcela,
                tipo: conta.tipo,
                parcelaAtual: (conta.parcela_atual || 1) + i,
                totalParcelas: conta.total_parcelas,
                contaOriginalId: conta.id,
                identificadorParcela: `${conta.id}-parcela-${i+1}`
              };
              
              todasAsContas.push(proximaParcela);
            }
          }
          
          // Gerar instâncias para contas fixas (recorrentes) - 24 meses à frente (2 anos)
          if (conta.tipo === 'fixo') {
            // Começar do próximo mês, pois o mês atual já foi adicionado
            for (let i = 1; i <= 24; i++) {
              const dataProximoMes = addMonths(new Date(conta.data_vencimento), i);
              
              const proximaOcorrencia = {
                id: `${conta.id}-recorrente-${i}`,
                nome: conta.nome,
                valor: parseFloat(conta.valor),
                dataVencimento: dataProximoMes,
                tipo: conta.tipo,
                parcelaAtual: null,
                totalParcelas: null,
                contaOriginalId: conta.id,
                identificadorRecorrente: `${conta.id}-recorrente-${i}`
              };
              
              todasAsContas.push(proximaOcorrencia);
            }
          }
        }

        setContas(todasAsContas);

        // Carregar rendas do usuário
        const { data: rendasData, error: rendasError } = await supabase
          .from('rendas')
          .select('*')
          .eq('usuario_id', usuario.id)
          .order('data_pagamento', { ascending: true });

        if (rendasError) throw rendasError;

        // Formatação dos dados de rendas
        const rendasFormatadas = rendasData.map(renda => ({
          id: renda.id,
          nome: renda.nome,
          valor: parseFloat(renda.valor),
          dataPagamento: renda.data_pagamento,
          tipo: renda.tipo
        }));

        setRendas(rendasFormatadas);
      } catch (erro) {
        console.error('Erro ao carregar dados:', erro);
        toast.error('Erro ao carregar seus dados. Tente novamente mais tarde.');
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [usuario, autenticado]);

  // Calcular a data da sexta-feira mais próxima para uma data
  const calcularSextaMaisProxima = (data) => {
    const dataClone = new Date(data);
    const diaDaSemana = dataClone.getDay(); // 0 = domingo, 6 = sábado
    
    // Se for sexta-feira (dia 5), retorna a própria data
    if (diaDaSemana === 5) return dataClone;
    
    // Se for sábado ou domingo, avança para a próxima sexta
    if (diaDaSemana === 6) { // sábado
      dataClone.setDate(dataClone.getDate() + 6);
    } else if (diaDaSemana === 0) { // domingo
      dataClone.setDate(dataClone.getDate() + 5);
    } else {
      // Para segunda a quinta, avança para a próxima sexta
      dataClone.setDate(dataClone.getDate() + (5 - diaDaSemana));
    }
    
    return dataClone;
  };

  // Filtrar contas com base nos critérios atuais
  const filtrarContas = () => {
    let contasFiltradas = [...contas];
    
    // Filtrar por tipo
    if (filtroTipo !== 'todos') {
      contasFiltradas = contasFiltradas.filter(conta => conta.tipo === filtroTipo);
    }
    
    // Filtrar por termo de busca
    if (termoBusca) {
      contasFiltradas = contasFiltradas.filter(conta => 
        conta.nome.toLowerCase().includes(termoBusca.toLowerCase())
      );
    }
    
    // Filtrar pelo mês atual
    contasFiltradas = contasFiltradas.filter(conta => {
      const dataConta = new Date(conta.dataVencimento);
      return dataConta.getMonth() === mesAtual && dataConta.getFullYear() === anoAtual;
    });
    
    return contasFiltradas;
  };

  // Organizar contas por semana (modo sexta-feira)
  const contasPorSemana = () => {
    const contasFiltradas = filtrarContas();
    const semanas = {};
    
    contasFiltradas.forEach(conta => {
      const dataVencimento = new Date(conta.dataVencimento);
      const sextaMaisProxima = calcularSextaMaisProxima(dataVencimento);
      const chave = sextaMaisProxima.toISOString().split('T')[0];
      
      if (!semanas[chave]) {
        semanas[chave] = [];
      }
      
      semanas[chave].push({
        ...conta,
        dataSexta: sextaMaisProxima
      });
    });
    
    return semanas;
  };

  // Adicionar uma nova conta
  const adicionarConta = async (novaConta) => {
    if (!usuario) {
      toast.error('Você precisa estar logado para adicionar uma conta.');
      return null;
    }
    
    try {
      const contaParaInserir = {
        usuario_id: usuario.id,
        nome: novaConta.nome,
        valor: novaConta.valor,
        data_vencimento: novaConta.dataVencimento.toISOString().split('T')[0],
        tipo: novaConta.tipo,
        parcela_atual: novaConta.tipo === 'parcelado' ? 1 : null,
        total_parcelas: novaConta.tipo === 'parcelado' ? novaConta.totalParcelas : null
      };
      
      const { data, error } = await supabase
        .from('contas')
        .insert(contaParaInserir)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Formatar a conta inserida
      const contaInserida = {
        id: data.id,
        nome: data.nome,
        valor: parseFloat(data.valor),
        dataVencimento: new Date(data.data_vencimento),
        tipo: data.tipo,
        parcelaAtual: data.parcela_atual,
        totalParcelas: data.total_parcelas,
        pago: data.pago
      };
      
      setContas(contasAtuais => [...contasAtuais, contaInserida]);
      return contaInserida.id;
    } catch (erro) {
      console.error('Erro ao adicionar conta:', erro);
      toast.error('Erro ao adicionar conta. Tente novamente.');
      return null;
    }
  };

  // Atualizar uma conta existente
  const atualizarConta = async (id, dadosAtualizados) => {
    if (!usuario) {
      toast.error('Você precisa estar logado para atualizar uma conta.');
      return;
    }
    
    try {
      const contaParaAtualizar = {};
      
      if (dadosAtualizados.nome) contaParaAtualizar.nome = dadosAtualizados.nome;
      if (dadosAtualizados.valor) contaParaAtualizar.valor = dadosAtualizados.valor;
      if (dadosAtualizados.dataVencimento) {
        contaParaAtualizar.data_vencimento = dadosAtualizados.dataVencimento.toISOString().split('T')[0];
      }
      if (dadosAtualizados.parcelaAtual) contaParaAtualizar.parcela_atual = dadosAtualizados.parcelaAtual;
      if (dadosAtualizados.totalParcelas) contaParaAtualizar.total_parcelas = dadosAtualizados.totalParcelas;
      if (dadosAtualizados.pago !== undefined) contaParaAtualizar.pago = dadosAtualizados.pago;
      
      // Obter a conta original antes de atualizar
      const { data: contaOriginal, error: erroConsulta } = await supabase
        .from('contas')
        .select('*')
        .eq('id', id)
        .single();
        
      if (erroConsulta) {
        throw erroConsulta;
      }
      
      // Atualizar a conta no banco de dados
      const { error } = await supabase
        .from('contas')
        .update(contaParaAtualizar)
        .eq('id', id)
        .eq('usuario_id', usuario.id);
        
      if (error) {
        throw error;
      }
      
      // Atualizar o estado das contas no front-end
      setContas(contasAtuais => {
        return contasAtuais.map(conta => {
          // Atualizar a conta original
          if (conta.id === id) {
            return { ...conta, ...dadosAtualizados };
          }
          
          // Atualizar as instâncias futuras de contas fixas
          if (conta.id.includes(`${id}-recorrente-`)) {
            const novaConta = { ...conta };
            
            // Atualizar o nome em todas as recorrências
            if (dadosAtualizados.nome) {
              novaConta.nome = dadosAtualizados.nome;
            }
            
            // Atualizar o valor em todas as recorrências
            if (dadosAtualizados.valor) {
              novaConta.valor = dadosAtualizados.valor;
            }
            
            return novaConta;
          }
          
          // Atualizar as parcelas futuras de contas parceladas
          if (conta.id.includes(`${id}-parcela-`)) {
            const novaConta = { ...conta };
            
            // Atualizar o nome em todas as parcelas
            if (dadosAtualizados.nome) {
              novaConta.nome = dadosAtualizados.nome;
            }
            
            // Atualizar o valor em todas as parcelas
            if (dadosAtualizados.valor) {
              novaConta.valor = dadosAtualizados.valor;
            }
            
            // Atualizar o total de parcelas
            if (dadosAtualizados.totalParcelas) {
              novaConta.totalParcelas = dadosAtualizados.totalParcelas;
            }
            
            return novaConta;
          }
          
          return conta;
        });
      });
      
      // Verificar se precisamos adicionar mais parcelas
      if (dadosAtualizados.totalParcelas && contaOriginal.tipo === 'parcelado') {
        const parcelasOriginais = contaOriginal.total_parcelas || 0;
        const novasParcelas = dadosAtualizados.totalParcelas - parcelasOriginais;
        
        // Se o número de parcelas aumentou, criar novas parcelas
        if (novasParcelas > 0) {
          const ultimaParcelaExistente = contas
            .filter(c => c.id.includes(`${id}-parcela-`))
            .sort((a, b) => b.parcelaAtual - a.parcelaAtual)[0];
            
          let ultimaData = ultimaParcelaExistente 
            ? new Date(ultimaParcelaExistente.dataVencimento) 
            : addMonths(new Date(contaOriginal.data_vencimento), parcelasOriginais - 1);
            
          const novasParcelasArray = [];
          
          for (let i = 1; i <= novasParcelas; i++) {
            const parcelaAtual = (parcelasOriginais || 1) + i;
            const dataProximaParcela = addMonths(new Date(ultimaData), i);
              
            const novaParcela = {
              id: `${id}-parcela-${parcelaAtual}`,
              nome: dadosAtualizados.nome || contaOriginal.nome,
              valor: dadosAtualizados.valor || parseFloat(contaOriginal.valor),
              dataVencimento: dataProximaParcela,
              tipo: 'parcelado',
              parcelaAtual,
              totalParcelas: dadosAtualizados.totalParcelas,
              contaOriginalId: id,
              identificadorParcela: `${id}-parcela-${parcelaAtual}`
            };
              
            novasParcelasArray.push(novaParcela);
          }
          
          // Adicionar as novas parcelas ao estado
          setContas(contasAtuais => [...contasAtuais, ...novasParcelasArray]);
        }
      }
      
      // Mostrar mensagem de sucesso
      toast.success('Conta atualizada com sucesso!');
    } catch (erro) {
      console.error('Erro ao atualizar conta:', erro);
      toast.error('Erro ao atualizar conta. Tente novamente.');
    }
  };

  // Remover uma conta
  const removerConta = async (id) => {
    if (!usuario) {
      toast.error('Você precisa estar logado para remover uma conta.');
      return;
    }
    
    try {
      // Verificar se é uma conta recorrente/parcela (ID contém '-recorrente-' ou '-parcela-')
      let idOriginal = id;
      
      // Se for uma conta recorrente ou uma parcela, extrair o ID original
      if (id.includes('-recorrente-')) {
        idOriginal = id.split('-recorrente-')[0];
      } else if (id.includes('-parcela-')) {
        idOriginal = id.split('-parcela-')[0];
      }
      
      // Remover a conta do banco de dados usando o ID original
      const { error } = await supabase
        .from('contas')
        .delete()
        .eq('id', idOriginal)
        .eq('usuario_id', usuario.id);
        
      if (error) {
        throw error;
      }
      
      // Atualizar o estado removendo todas as instâncias relacionadas à conta
      // Isso inclui a conta original e todas as recorrências/parcelas
      setContas(contasAtuais => 
        contasAtuais.filter(conta => {
          // Remover a conta original
          if (conta.id === idOriginal) {
            return false;
          }
          
          // Remover todas as recorrências relacionadas
          if (conta.id.includes(`${idOriginal}-recorrente-`)) {
            return false;
          }
          
          // Remover todas as parcelas relacionadas
          if (conta.id.includes(`${idOriginal}-parcela-`)) {
            return false;
          }
          
          return true;
        })
      );
      
      toast.success('Conta removida com sucesso!');
    } catch (erro) {
      console.error('Erro ao remover conta:', erro);
      toast.error('Erro ao remover conta. Tente novamente.');
    }
  };

  // Adicionar uma nova renda
  const adicionarRenda = async (novaRenda) => {
    if (!usuario) {
      toast.error('Você precisa estar logado para adicionar uma renda.');
      return null;
    }
    
    try {
      const rendaParaInserir = {
        usuario_id: usuario.id,
        nome: novaRenda.nome,
        valor: novaRenda.valor,
        data_pagamento: novaRenda.dataPagamento,
        tipo: novaRenda.tipo
      };
      
      const { data, error } = await supabase
        .from('rendas')
        .insert(rendaParaInserir)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Formatar a renda inserida
      const rendaInserida = {
        id: data.id,
        nome: data.nome,
        valor: parseFloat(data.valor),
        dataPagamento: data.data_pagamento,
        tipo: data.tipo
      };
      
      setRendas(rendasAtuais => [...rendasAtuais, rendaInserida]);
      return rendaInserida.id;
    } catch (erro) {
      console.error('Erro ao adicionar renda:', erro);
      toast.error('Erro ao adicionar renda. Tente novamente.');
      return null;
    }
  };

  // Atualizar uma renda existente
  const atualizarRenda = async (id, dadosAtualizados) => {
    if (!usuario) {
      toast.error('Você precisa estar logado para atualizar uma renda.');
      return;
    }
    
    try {
      const rendaParaAtualizar = {};
      
      if (dadosAtualizados.nome) rendaParaAtualizar.nome = dadosAtualizados.nome;
      if (dadosAtualizados.valor) rendaParaAtualizar.valor = dadosAtualizados.valor;
      if (dadosAtualizados.dataPagamento) rendaParaAtualizar.data_pagamento = dadosAtualizados.dataPagamento;
      if (dadosAtualizados.tipo) rendaParaAtualizar.tipo = dadosAtualizados.tipo;
      
      const { error } = await supabase
        .from('rendas')
        .update(rendaParaAtualizar)
        .eq('id', id)
        .eq('usuario_id', usuario.id);
        
      if (error) {
        throw error;
      }
      
      setRendas(rendasAtuais => 
        rendasAtuais.map(renda => 
          renda.id === id ? { ...renda, ...dadosAtualizados } : renda
        )
      );
    } catch (erro) {
      console.error('Erro ao atualizar renda:', erro);
      toast.error('Erro ao atualizar renda. Tente novamente.');
    }
  };

  // Remover uma renda
  const removerRenda = async (id) => {
    if (!usuario) {
      toast.error('Você precisa estar logado para remover uma renda.');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('rendas')
        .delete()
        .eq('id', id)
        .eq('usuario_id', usuario.id);
        
      if (error) {
        throw error;
      }
      
      setRendas(rendasAtuais => rendasAtuais.filter(renda => renda.id !== id));
      toast.success('Fonte de renda removida com sucesso!');
    } catch (erro) {
      console.error('Erro ao remover renda:', erro);
      toast.error('Erro ao remover renda. Tente novamente.');
    }
  };

  // Função auxiliar para contar o número de sextas-feiras em um mês específico
  const contarSextasNoMes = (mes, ano) => {
    // Primeiro dia do mês
    const primeiroDia = new Date(ano, mes, 1);
    // Último dia do mês
    const ultimoDia = new Date(ano, mes + 1, 0);
    
    let contadorSextas = 0;
    // Começar do primeiro dia do mês
    const data = new Date(primeiroDia);
    
    // Percorrer todos os dias do mês
    while (data <= ultimoDia) {
      // Verificar se é sexta-feira (5 = sexta-feira)
      if (data.getDay() === 5) {
        contadorSextas++;
      }
      // Avançar para o próximo dia
      data.setDate(data.getDate() + 1);
    }
    
    return contadorSextas;
  };

  // Calcular renda total mensal
  const calcularRendaMensal = () => {
    // Contar quantas sextas-feiras tem no mês atual
    const numeroSextas = contarSextasNoMes(mesAtual, anoAtual);
    
    return rendas.reduce((total, renda) => {
      if (renda.tipo === 'mensal') {
        return total + renda.valor;
      }
      if (renda.tipo === 'quinzenal') {
        return total + (renda.valor * 2);
      }
      if (renda.tipo === 'semanal') {
        // Usar o número real de sextas-feiras no mês
        return total + (renda.valor * numeroSextas);
      }
      return total;
    }, 0);
  };

  // Calcular renda para uma data específica (uma sexta-feira específica)
  const calcularRendaParaData = (data) => {
    if (!data) return 0;
    
    const dataSexta = new Date(data);
    const primeiroDiaDoMes = new Date(dataSexta.getFullYear(), dataSexta.getMonth(), 1);
    const ultimoDiaDoMes = new Date(dataSexta.getFullYear(), dataSexta.getMonth() + 1, 0);
    
    let totalRenda = 0;
    
    rendas.forEach(renda => {
      // Rendas semanais aparecem em todas as sextas-feiras
      if (renda.tipo === 'semanal') {
        totalRenda += renda.valor;
        return;
      }
      
      // Para rendas mensais, verificar se a data da sexta é a mais próxima ao dia de pagamento
      if (renda.tipo === 'mensal') {
        // Data de recebimento da renda no mês atual
        const dataRecebimento = new Date(dataSexta.getFullYear(), dataSexta.getMonth(), renda.dataPagamento);
        
        // Se a data de recebimento for inválida (ex: 31 em mês com 30 dias), usar o último dia do mês
        if (dataRecebimento.getMonth() !== dataSexta.getMonth()) {
          dataRecebimento.setDate(0); // Volta para o último dia do mês anterior
        }
        
        // Calcular a sexta-feira mais próxima da data de recebimento
        const sextaRecebimento = calcularSextaMaisProxima(dataRecebimento);
        
        // Se a sexta atual for a mesma da sexta de recebimento, adicionar o valor
        if (dataSexta.getDate() === sextaRecebimento.getDate() && 
            dataSexta.getMonth() === sextaRecebimento.getMonth()) {
          totalRenda += renda.valor;
        }
        
        return;
      }
      
      // Para rendas quinzenais, verificar se é a primeira ou a segunda quinzena
      if (renda.tipo === 'quinzenal') {
        const diaMeio = Math.floor(ultimoDiaDoMes.getDate() / 2);
        
        // Definir se a data de pagamento é na primeira ou segunda quinzena
        let dataRecebimento;
        if (renda.dataPagamento === 1) { // Primeira quinzena
          dataRecebimento = new Date(dataSexta.getFullYear(), dataSexta.getMonth(), 10); // Dia 10
        } else { // Segunda quinzena
          dataRecebimento = new Date(dataSexta.getFullYear(), dataSexta.getMonth(), 25); // Dia 25
        }
        
        // Calcular a sexta-feira mais próxima da data de recebimento
        const sextaRecebimento = calcularSextaMaisProxima(dataRecebimento);
        
        // Se a sexta atual for a mesma da sexta de recebimento, adicionar o valor
        if (dataSexta.getDate() === sextaRecebimento.getDate() && 
            dataSexta.getMonth() === sextaRecebimento.getMonth()) {
          totalRenda += renda.valor;
        }
      }
    });
    
    return totalRenda;
  };

  // Calcular renda semanal média (apenas para referência - não será mais usado nos componentes)
  const calcularRendaSemanal = () => {
    const rendaMensal = calcularRendaMensal();
    return rendaMensal / 4; // Simplificação: dividir a renda mensal por 4 semanas
  };

  // Ir para o próximo mês
  const irParaProximoMes = () => {
    if (mesAtual === 11) {
      setMesAtual(0);
      setAnoAtual(anoAtual + 1);
    } else {
      setMesAtual(mesAtual + 1);
    }
  };

  // Ir para o mês anterior
  const irParaMesAnterior = () => {
    if (mesAtual === 0) {
      setMesAtual(11);
      setAnoAtual(anoAtual - 1);
    } else {
      setMesAtual(mesAtual - 1);
    }
  };

  // Verificar se uma conta específica está paga em um determinado mês/ano
  const verificarContaPaga = (conta, mes, ano) => {
    // Para contas do tipo 'unica', verifique o status 'pago' diretamente na conta
    if (conta.tipo === 'unica' && !conta.id.includes('-parcela-') && !conta.id.includes('-recorrente-')) {
      return conta.pago;
    }
    
    // Para contas parceladas e fixas, verifique na tabela pagamentos_contas
    const dataVencimento = new Date(conta.dataVencimento);
    const mesVencimento = dataVencimento.getMonth();
    const anoVencimento = dataVencimento.getFullYear();
    
    // Verificamos se o mês e ano especificados correspondem à data de vencimento
    if (mesVencimento !== mes || anoVencimento !== ano) {
      return false;
    }
    
    // Identificador para a conta específica (original ou parcela/recorrência específica)
    const contaId = conta.contaOriginalId || conta.id;
    
    // Verificar se existe um pagamento registrado para esta conta neste mês/ano específico
    return pagamentosContas.some(pagamento => {
      const isPagamentoMesmaConta = pagamento.conta_id === contaId;
      const isPagamentoMesmoMes = pagamento.mes === mes;
      const isPagamentoMesmoAno = pagamento.ano === ano;
      
      // Para contas parceladas, verificar também o identificador de parcela
      const isParcelada = conta.tipo === 'parcelado' && conta.id.includes('-parcela-');
      const isParcelaCorreta = isParcelada ? 
        pagamento.identificador_parcela === conta.identificadorParcela : true;
      
      // Para contas fixas, verificar também o identificador de recorrência
      const isFixa = conta.tipo === 'fixo' && conta.id.includes('-recorrente-');
      const isRecorrenciaCorreta = isFixa ? 
        pagamento.identificador_parcela === conta.identificadorRecorrente : true;
      
      return isPagamentoMesmaConta && isPagamentoMesmoMes && isPagamentoMesmoAno && 
             (isParcelaCorreta || isRecorrenciaCorreta);
    });
  };

  // Marcar uma conta como paga
  const marcarContaComoPaga = async (conta) => {
    if (!usuario) {
      toast.error('Você precisa estar logado para marcar uma conta como paga.');
      return;
    }
    
    try {
      const dataVencimento = new Date(conta.dataVencimento);
      const mes = dataVencimento.getMonth();
      const ano = dataVencimento.getFullYear();
      const contaId = conta.contaOriginalId || conta.id;
      
      // Determinar o identificador de parcela/recorrência (se aplicável)
      let identificadorParcela = null;
      if (conta.tipo === 'parcelado' && conta.id.includes('-parcela-')) {
        identificadorParcela = conta.identificadorParcela;
      } else if (conta.tipo === 'fixo' && conta.id.includes('-recorrente-')) {
        identificadorParcela = conta.identificadorRecorrente;
      }
      
      if (conta.tipo === 'unica' && !conta.id.includes('-parcela-') && !conta.id.includes('-recorrente-')) {
        // Para contas do tipo 'unica', atualizamos diretamente na tabela contas
        const { error } = await supabase
          .from('contas')
          .update({ pago: true })
          .eq('id', conta.id)
          .eq('usuario_id', usuario.id);
          
        if (error) throw error;
        
        // Atualizar o estado
        setContas(contasAtuais => 
          contasAtuais.map(c => c.id === conta.id ? { ...c, pago: true } : c)
        );
        
        toast.success('Conta marcada como paga!');
        return;
      }
      
      // Para contas parceladas e fixas, registramos na tabela pagamentos_contas
      const novoPagamento = {
        usuario_id: usuario.id,
        conta_id: contaId,
        data_pagamento: format(new Date(), 'yyyy-MM-dd'),
        data_vencimento: format(dataVencimento, 'yyyy-MM-dd'),
        mes,
        ano,
        tipo_conta: conta.tipo,
        identificador_parcela: identificadorParcela
      };
      
      const { error } = await supabase
        .from('pagamentos_contas')
        .insert(novoPagamento);
      
      if (error) throw error;
      
      // Adicionar o novo pagamento ao estado
      setPagamentosContas(pagamentosAtuais => [...pagamentosAtuais, novoPagamento]);
      
      toast.success('Conta marcada como paga!');
    } catch (erro) {
      console.error('Erro ao marcar conta como paga:', erro);
      toast.error('Erro ao marcar conta como paga. Tente novamente.');
    }
  };

  // Desmarcar uma conta como paga
  const desmarcarContaComoPaga = async (conta) => {
    if (!usuario) {
      toast.error('Você precisa estar logado para desmarcar uma conta como paga.');
      return;
    }
    
    try {
      const dataVencimento = new Date(conta.dataVencimento);
      const mes = dataVencimento.getMonth();
      const ano = dataVencimento.getFullYear();
      const contaId = conta.contaOriginalId || conta.id;
      
      if (conta.tipo === 'unica' && !conta.id.includes('-parcela-') && !conta.id.includes('-recorrente-')) {
        // Para contas do tipo 'unica', atualizamos diretamente na tabela contas
        const { error } = await supabase
          .from('contas')
          .update({ pago: false })
          .eq('id', conta.id)
          .eq('usuario_id', usuario.id);
          
        if (error) throw error;
        
        // Atualizar o estado
        setContas(contasAtuais => 
          contasAtuais.map(c => c.id === conta.id ? { ...c, pago: false } : c)
        );
        
        toast.success('Conta desmarcada como paga!');
        return;
      }
      
      // Para contas parceladas e fixas, removemos o registro da tabela pagamentos_contas
      let identificadorParcela = null;
      if (conta.tipo === 'parcelado' && conta.id.includes('-parcela-')) {
        identificadorParcela = conta.identificadorParcela;
      } else if (conta.tipo === 'fixo' && conta.id.includes('-recorrente-')) {
        identificadorParcela = conta.identificadorRecorrente;
      }
      
      // Filtros para encontrar o pagamento correto a ser removido
      const filtros = {
        usuario_id: usuario.id,
        conta_id: contaId,
        mes,
        ano,
        tipo_conta: conta.tipo
      };
      
      // Adicionar o identificador de parcela se existir
      if (identificadorParcela) {
        filtros.identificador_parcela = identificadorParcela;
      }
      
      // Excluir o pagamento
      const { error } = await supabase
        .from('pagamentos_contas')
        .delete()
        .eq('usuario_id', usuario.id)
        .eq('conta_id', contaId)
        .eq('mes', mes)
        .eq('ano', ano)
        .eq('tipo_conta', conta.tipo);
      
      if (error) throw error;
      
      // Atualizar o estado de pagamentos removendo o item excluído
      setPagamentosContas(pagamentosAtuais => 
        pagamentosAtuais.filter(pagamento => 
          !(pagamento.conta_id === contaId && 
            pagamento.mes === mes && 
            pagamento.ano === ano && 
            pagamento.tipo_conta === conta.tipo &&
            (identificadorParcela ? pagamento.identificador_parcela === identificadorParcela : true))
        )
      );
      
      toast.success('Conta desmarcada como paga!');
    } catch (erro) {
      console.error('Erro ao desmarcar conta como paga:', erro);
      toast.error('Erro ao desmarcar conta como paga. Tente novamente.');
    }
  };

  // Alternar o estado de pagamento da conta (marcar/desmarcar como paga)
  const alternarPagamentoConta = (conta) => {
    const estaPaga = verificarContaPaga(
      conta, 
      conta.dataVencimento.getMonth(), 
      conta.dataVencimento.getFullYear()
    );
    
    if (estaPaga) {
      desmarcarContaComoPaga(conta);
    } else {
      marcarContaComoPaga(conta);
    }
  };

  // Obter comentários de uma conta específica para o mês atual
  const obterComentariosDaConta = (conta) => {
    // Se a conta não existe, retorna array vazio
    if (!conta) return [];
    
    const dataVencimento = new Date(conta.dataVencimento);
    const mes = dataVencimento.getMonth();
    const ano = dataVencimento.getFullYear();
    const contaId = conta.contaOriginalId || conta.id;
    
    // Determinar o identificador de parcela/recorrência (se aplicável)
    let identificadorParcela = null;
    if (conta.tipo === 'parcelado' && conta.id.includes('-parcela-')) {
      identificadorParcela = conta.identificadorParcela;
    } else if (conta.tipo === 'fixo' && conta.id.includes('-recorrente-')) {
      identificadorParcela = conta.identificadorRecorrente;
    }
    
    // Filtrar comentários para a conta e mês/ano específicos
    return comentariosContas.filter(comentario => {
      const isComentarioMesmaConta = comentario.conta_id === contaId;
      const isComentarioMesmoMes = comentario.mes === mes;
      const isComentarioMesmoAno = comentario.ano === ano;
      
      // Para contas parceladas, verificar também o identificador de parcela
      const isParcelada = conta.tipo === 'parcelado' && conta.id.includes('-parcela-');
      const isParcelaCorreta = isParcelada ? 
        comentario.identificador_parcela === identificadorParcela : true;
      
      // Para contas fixas, verificar também o identificador de recorrência
      const isFixa = conta.tipo === 'fixo' && conta.id.includes('-recorrente-');
      const isRecorrenciaCorreta = isFixa ? 
        comentario.identificador_parcela === identificadorParcela : true;
      
      return isComentarioMesmaConta && isComentarioMesmoMes && isComentarioMesmoAno && 
             (isParcelaCorreta || isRecorrenciaCorreta);
    }).sort((a, b) => new Date(b.data_comentario) - new Date(a.data_comentario)); // Ordenar do mais recente para o mais antigo
  };

  // Adicionar um comentário a uma conta
  const adicionarComentarioNaConta = async (conta, texto) => {
    if (!usuario) {
      toast.error('Você precisa estar logado para adicionar um comentário.');
      return null;
    }
    
    try {
      const dataVencimento = new Date(conta.dataVencimento);
      const mes = dataVencimento.getMonth();
      const ano = dataVencimento.getFullYear();
      const contaId = conta.contaOriginalId || conta.id;
      
      // Determinar o identificador de parcela/recorrência (se aplicável)
      let identificadorParcela = null;
      if (conta.tipo === 'parcelado' && conta.id.includes('-parcela-')) {
        identificadorParcela = conta.identificadorParcela;
      } else if (conta.tipo === 'fixo' && conta.id.includes('-recorrente-')) {
        identificadorParcela = conta.identificadorRecorrente;
      }
      
      const novoComentario = {
        usuario_id: usuario.id,
        conta_id: contaId,
        texto,
        data_comentario: new Date().toISOString(),
        mes,
        ano,
        tipo_conta: conta.tipo,
        identificador_parcela: identificadorParcela
      };
      
      const { data, error } = await supabase
        .from('comentarios_contas')
        .insert(novoComentario)
        .select();
      
      if (error) throw error;
      
      // Adicionar o novo comentário ao estado
      setComentariosContas(comentariosAtuais => [...comentariosAtuais, data[0]]);
      
      toast.success('Comentário adicionado com sucesso!');
      return data[0];
    } catch (erro) {
      console.error('Erro ao adicionar comentário:', erro);
      toast.error('Erro ao adicionar comentário. Tente novamente.');
      return null;
    }
  };

  // Remover um comentário
  const removerComentario = async (comentarioId) => {
    if (!usuario) {
      toast.error('Você precisa estar logado para remover um comentário.');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('comentarios_contas')
        .delete()
        .eq('id', comentarioId)
        .eq('usuario_id', usuario.id);
      
      if (error) throw error;
      
      // Atualizar o estado removendo o comentário excluído
      setComentariosContas(comentariosAtuais => 
        comentariosAtuais.filter(comentario => comentario.id !== comentarioId)
      );
      
      toast.success('Comentário removido com sucesso!');
    } catch (erro) {
      console.error('Erro ao remover comentário:', erro);
      toast.error('Erro ao remover comentário. Tente novamente.');
    }
  };

  // Valores a serem fornecidos pelo contexto
  const value = {
    contas,
    rendas,
    pagamentosContas,
    comentariosContas,
    modoVisualizacao,
    filtroTipo,
    termoBusca,
    mesAtual,
    anoAtual,
    carregando,
    setModoVisualizacao,
    setFiltroTipo,
    setTermoBusca,
    adicionarConta,
    atualizarConta,
    removerConta,
    adicionarRenda,
    atualizarRenda,
    removerRenda,
    filtrarContas,
    contasPorSemana,
    calcularRendaMensal,
    calcularRendaSemanal,
    calcularRendaParaData,
    irParaProximoMes,
    irParaMesAnterior,
    verificarContaPaga,
    marcarContaComoPaga,
    desmarcarContaComoPaga,
    alternarPagamentoConta,
    obterComentariosDaConta,
    adicionarComentarioNaConta,
    removerComentario
  };

  return <ContasContext.Provider value={value}>{children}</ContasContext.Provider>;
}
