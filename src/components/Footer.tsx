import logoCopa from "@/assets/logo-copa-sporting.jpeg";

const Footer = () => (
  <footer className="bg-field text-field-foreground">
    <div className="container py-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src={logoCopa} alt="Copa do Mundo Sporting" className="h-14 w-14 rounded-full object-cover" />
          <div>
            <p className="font-display text-xl font-bold tracking-wide">COPA DO MUNDO SPORTING</p>
            <p className="text-sm text-field-foreground/60">Torneio Interno Esporte</p>
          </div>
        </div>
        <div className="text-center md:text-right space-y-1">
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
    </div>
  </footer>
);

export default Footer;
