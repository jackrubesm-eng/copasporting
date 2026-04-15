import logoCopa from "@/assets/logo-copa-sporting.jpeg";
import logoSporting from "@/assets/logo-sporting.png";

const Footer = () => (
  <footer className="bg-field text-field-foreground">
    <div className="container py-10 space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src={logoCopa} alt="Copa do Mundo Sporting" className="h-14 w-14 rounded-full object-cover" />
          <div>
            <p className="font-display text-xl font-bold tracking-wide">COPA DO MUNDO SPORTING</p>
            <p className="text-sm text-field-foreground/60">Torneio Interno Esporte</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <img src={logoSporting} alt="Sporting 42" className="h-14 w-14 object-contain" />
          <div>
            <p className="font-display text-sm font-bold tracking-wide">Realização</p>
            <p className="text-xs text-field-foreground/60">Sporting 42 — Valores & Futebol</p>
          </div>
        </div>
      </div>
      <div className="text-center space-y-1 border-t border-field-foreground/10 pt-4">
        <p className="text-sm text-field-foreground/50">
          © Copa do Mundo Sporting — Torneio Interno Esporte. Todos os direitos reservados.
        </p>
        <p className="text-xs text-field-foreground/40">
          Desenvolvido por{" "}
          <a href="https://armtech.net.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
            Arm Tech
          </a>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
