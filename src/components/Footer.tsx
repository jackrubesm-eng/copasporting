import logoCopa from "@/assets/logo-copa.jpeg";
import { teams } from "@/data/teams";

const Footer = () => (
  <footer className="bg-field text-field-foreground">
    <div className="container py-12">
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logoCopa} alt="Copa Pampa" className="h-12 w-12 rounded-lg object-cover" />
            <div>
              <p className="font-display text-2xl tracking-wide">COPA PAMPA</p>
              <p className="text-xs text-field-foreground/50 tracking-widest">FUT 7 • 2026</p>
            </div>
          </div>
          <p className="text-sm text-field-foreground/60 leading-relaxed">
            O maior torneio de Futebol 7 da região metropolitana do Rio Grande do Sul.
          </p>
        </div>

        <div>
          <h3 className="font-display text-lg tracking-wider mb-3 text-field-foreground/80">EQUIPES</h3>
          <div className="flex flex-wrap gap-2">
            {teams.map((team) => (
              <img key={team.id} src={team.logo} alt={team.shortName} className="h-9 w-9 rounded-full object-cover border-2 border-field-foreground/10" />
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg tracking-wider mb-3 text-field-foreground/80">LINKS</h3>
          <div className="space-y-1">
            {["Categorias", "Times", "Regulamento", "Contato"].map(l => (
              <a key={l} href={`/${l.toLowerCase()}`} className="block text-sm text-field-foreground/50 hover:text-field-foreground/90 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-field-foreground/10 pt-6">
        <p className="text-xs text-field-foreground/40 text-center">
          © 2026 Copa Pampa Futebol 7. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
