import { motion } from "framer-motion";

const Regulamento = () => (
  <div className="container py-12 max-w-3xl">
    <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Regras</p>
    <h1 className="font-display text-5xl text-foreground tracking-tight mb-10">REGULAMENTO</h1>

    <div className="space-y-4">
      {[
        { title: "1. Modalidade", content: "A Copa Pampa é disputada na modalidade Futebol 7, com equipes compostas por 7 jogadores em campo." },
        { title: "2. Categorias", content: "Sub 7, Sub 9, Sub 11, Sub 13 e Sub 15. Cada categoria conta com 6 equipes." },
        { title: "3. Formato", content: "Fase de grupos com todos contra todos dentro da mesma categoria." },
        { title: "4. Pontuação", content: "Vitória no tempo normal: 3 pontos. Empate com vitória nos pênaltis: 2 pontos para o vencedor e 1 ponto para o perdedor. Derrota no tempo normal: 0 pontos." },
        { title: "5. Critérios de Desempate", content: "1º Pontos; 2º Número de vitórias; 3º Saldo de gols; 4º Gols pró." },
        { title: "6. Elegibilidade para Finais", content: "O atleta deve cumprir um número mínimo de jogos na fase de grupos para ser elegível na fase final." },
      ].map((section, i) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.06 * i }}
          className="bg-card border border-border rounded-xl p-6 shadow-card"
        >
          <h2 className="font-display text-xl text-foreground mb-2">{section.title}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{section.content}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

export default Regulamento;
