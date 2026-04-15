import logoCopa from "@/assets/logo-copa-sporting.jpeg";

const Footer = () => (
  <footer className="bg-field text-field-foreground">
    <div className="container py-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src={logoCopa} alt="Copa Sporting" className="h-14 w-14 rounded-full object-cover" />
          <div>
            <p className="font-display text-xl font-bold tracking-wide">COPA SPORTING</p>
            <p className="text-sm text-field-foreground/60">Copa do Mundo Esporte • 2026</p>
          </div>
        </div>
        <p className="text-sm text-field-foreground/50">
          © 2026 Copa Sporting — Torneio Interno Esporte. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
