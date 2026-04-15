import { Mail, MapPin, Phone } from "lucide-react";

const Contato = () => (
  <div className="container py-10 max-w-2xl">
    <h1 className="font-display text-3xl font-bold text-foreground uppercase tracking-wider mb-8">Contato</h1>

    <div className="space-y-4">
      {[
        { icon: Mail, label: "E-mail", value: "contato@copasporting.com.br" },
        { icon: Phone, label: "Telefone", value: "(51) 99999-9999" },
        { icon: MapPin, label: "Localização", value: "Esporte — Porto Alegre, RS" },
      ].map((item) => (
        <div key={item.label} className="bg-card border border-border rounded-lg p-5 flex items-center gap-4 shadow-card-sport">
          <item.icon className="h-6 w-6 text-primary flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
            <p className="font-medium text-foreground">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Contato;
