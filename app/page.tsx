"use client"; 

import { useState, useEffect } from "react";

// Aqui a gente avisa pro TypeScript o formato exato que nossa moeda vai ter
type Moeda = {
  nome: string;
  sigla: string;
  valor: string;
};

export default function Home() {
  // Agora o estado não é mais um texto nulo, mas sim uma lista (array) de Moedas
  const [moedas, setMoedas] = useState<Moeda[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [valorReal, setValorReal] = useState<string>("1"); // Começa com 1 real por padrão
  const [tema, setTema] = useState("escuro");

  async function puxarCotacoes() {
    setCarregando(true);
    try {
      // Pedimos as 6 moedas principais separadas por vírgula na mesma requisição
      const url = "https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,GBP-BRL,JPY-BRL,CHF-BRL,AUD-BRL";
      const resposta = await fetch(url);
      const dados = await resposta.json();
      
      // A API devolve um objetozão solto. Aqui a gente organiza isso numa lista limpa
      const listaFormatada = [
        { nome: "Dólar Americano", sigla: "USD", valor: dados.USDBRL.ask },
        { nome: "Euro", sigla: "EUR", valor: dados.EURBRL.ask },
        { nome: "Libra Esterlina", sigla: "GBP", valor: dados.GBPBRL.ask },
        { nome: "Iene Japonês", sigla: "JPY", valor: dados.JPYBRL.ask },
        { nome: "Franco Suíço", sigla: "CHF", valor: dados.CHFBRL.ask },
        { nome: "Dólar Australiano", sigla: "AUD", valor: dados.AUDBRL.ask },
      ];

      setMoedas(listaFormatada);
    } catch (erro) {
      console.error("Deu ruim na API:", erro);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    puxarCotacoes();
  }, []);

  return (
    // Aqui o data-theme injeta as cores, e o bg-fundo / text-texto reagem a ele
    <main data-theme={tema} className="min-h-screen bg-fundo flex flex-col items-center py-12 px-4 text-texto transition-colors duration-300">
      <div className="max-w-5xl w-full">
        
        {/* Cabeçalho do Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-texto">Painel de Cotações</h1>
            <p className="text-texto opacity-70 mt-1">Análise das 6 principais moedas globais</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <select 
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              className="bg-card text-texto border-2 border-bordaFoco/50 focus:border-bordaFoco p-3 rounded-lg outline-none font-medium cursor-pointer transition-colors"
            >
              <option value="escuro">Tema Escuro (Dourado/Roxo)</option>
              <option value="original">Tema Original (Verde Esmeralda)</option>
              <option value="claro-1">Tema Claro (Minimalista)</option>
              <option value="claro-2">Tema Claro (Aconchegante)</option>
            </select>

            <button 
              onClick={puxarCotacoes}
              className="bg-card border-2 border-transparent hover:border-bordaFoco transition-colors px-6 py-3 rounded-lg font-bold text-destaque shadow-md"
            >
              Atualizar Valores
            </button>
          </div>
        </div>

        {/* Barra de Input em Real */}
        <div className="mb-8 bg-card p-6 rounded-xl border border-bordaFoco/30 shadow-lg w-full max-w-md mx-auto transition-colors">
          <label htmlFor="valorBrl" className="block text-sm font-semibold text-texto opacity-80 mb-2 text-center">
            Valor em Reais (R$)
          </label>
          <input
            id="valorBrl"
            type="number"
            value={valorReal}
            onChange={(e) => setValorReal(e.target.value)}
            placeholder="Ex: 50"
            className="w-full bg-fundo border-2 border-bordaFoco/50 rounded-lg p-3 text-3xl text-center font-bold text-destaque focus:outline-none focus:border-bordaFoco transition-colors"
          />
        </div>

        {/* Área dos Cards */}
        {carregando ? (
          <div className="text-center py-20 text-texto opacity-50 animate-pulse text-xl font-medium">
            Buscando dados no mercado global...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {moedas.map((moeda) => (
              <div 
                key={moeda.sigla} 
                className="bg-card p-6 rounded-xl shadow-lg border border-bordaFoco/20 flex flex-col hover:border-bordaFoco transition-colors"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-texto opacity-70 uppercase tracking-wider">
                    {moeda.nome}
                  </span>
                  <span className="bg-fundo text-destaque text-xs font-bold px-2 py-1 rounded border border-bordaFoco/30">
                    {moeda.sigla}
                  </span>
                </div>
                
                <span className="text-4xl font-black text-destaque">
                  {Number((Number(valorReal) || 0) / Number(moeda.valor)).toFixed(2)}
                </span>

                <div className="mt-4 text-sm text-texto opacity-60 font-medium border-t border-bordaFoco/20 pt-3">
                  Cotação: 1 {moeda.sigla} = R$ {Number(moeda.valor).toFixed(2)}
                </div>
              </div>
            ))}
            
          </div>
        )}
        
      </div>
    </main>
  );
}