import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";

const Contato = () => (
  <div className="container py-12 max-w-2xl">
    <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Fale Conosco</p>
    <h1 className="font-display text-5xl text-foreground tracking-tight mb-10">CONTATO</h1>

    <div className="space-y-3">
      {[
        { icon: Mail, label: "E-mail", value: "contato@copapampa.com.br" },
        { icon: Phone, label: "Telefone", value: "(51) 99999-9999" },
        { icon: MapPin, label: "Localização", value: "Região Metropolitana – Porto Alegre, RS" },
      ].map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 * i }}
          className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 shadow-card"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <item.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-medium">{item.label}</p>
            <p className="font-semibold text-foreground">{item.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default Contato;
