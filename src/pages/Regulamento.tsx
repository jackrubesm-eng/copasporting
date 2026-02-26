const Regulamento = () => (
  <div className="container py-10 max-w-3xl">
    <h1 className="font-display text-3xl font-bold text-foreground uppercase tracking-wider mb-8">Regulamento</h1>

    <div className="prose prose-sm max-w-none space-y-6">
      {[
        {
          title: "1. Modalidade",
          content: "A Copa Pampa é disputada na modalidade Futebol 7, com equipes compostas por 7 jogadores em campo."
        },
        {
          title: "2. Categorias",
          content: "Sub 7, Sub 9, Sub 11, Sub 13 e Sub 15. Cada categoria conta com 6 equipes."
        },
        {
          title: "3. Formato",
          content: "Fase de grupos com todos contra todos dentro da mesma categoria."
        },
        {
          title: "4. Pontuação",
          content: "Vitória no tempo normal: 3 pontos. Empate com vitória nos pênaltis: 2 pontos para o vencedor e 1 ponto para o perdedor. Derrota no tempo normal: 0 pontos."
        },
        {
          title: "5. Critérios de Desempate",
          content: "1º Pontos; 2º Número de vitórias; 3º Saldo de gols; 4º Gols pró."
        },
        {
          title: "6. Elegibilidade para Finais",
          content: "O atleta deve cumprir um número mínimo de jogos na fase de grupos para ser elegível na fase final."
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
