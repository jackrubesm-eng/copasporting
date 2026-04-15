const Regulamento = () => (
  <div className="container py-10 max-w-3xl">
    <h1 className="font-display text-3xl font-bold text-foreground uppercase tracking-wider mb-8">Regulamento</h1>

    <div className="prose prose-sm max-w-none space-y-6">
      {[
        {
          title: "1. Torneio",
          content: "A Copa Sporting é um torneio interno anual da Esporte. Na edição 2026, o tema é Copa do Mundo, com seleções representando os países participantes."
        },
        {
          title: "2. Categorias",
          content: "Pré-mirim, Mirim e Infantil. Cada categoria conta com 6 seleções."
        },
        {
          title: "3. Formato",
          content: "Fase de grupos com todos contra todos dentro da mesma categoria. As seleções jogam apenas contra adversários da mesma categoria."
        },
        {
          title: "4. Pontuação",
          content: "Vitória no tempo normal: 3 pontos. Empate com vitória nos pênaltis: 2 pontos para o vencedor e 1 ponto para o perdedor. Derrota no tempo normal: 0 pontos."
        },
        {
          title: "5. Critérios de Desempate",
          content: "1º Pontos; 2º Número de vitórias; 3º Saldo de gols; 4º Gols pró."
        },
      ].map((section) => (
        <div key={section.title} className="bg-card border border-border rounded-lg p-5 shadow-card-sport">
          <h2 className="font-display text-lg font-bold text-foreground mb-2">{section.title}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{section.content}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Regulamento;
