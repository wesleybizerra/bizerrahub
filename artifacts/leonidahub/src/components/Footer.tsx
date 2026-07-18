import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="w-full bg-[#0B0B14] border-t border-white/5 py-12 px-4 md:px-6 mt-20 relative overflow-hidden">
      {/* Decorative neon glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1 bg-brand-gradient blur-[30px] opacity-20 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center gap-1 mb-4">
            <span className="font-display text-3xl tracking-tighter text-white">
              BIZERRA
            </span>
            <span className="font-display text-3xl tracking-tighter text-transparent bg-clip-text bg-brand-gradient">HUB</span>
          </Link>
          <p className="text-text-muted text-sm max-w-md font-medium leading-relaxed">
            O ponto de encontro do roleplay brasileiro. Hoje com os melhores servidores do GTA V — no dia 19/11/2026, o hub oficial da nova geração.
          </p>
        </div>
        
        <div>
          <h4 className="font-display text-white text-lg tracking-tight mb-4">Navegação</h4>
          <ul className="flex flex-col gap-3">
            <li><Link href="/servidores" className="text-text-muted hover:text-primary transition-colors text-sm font-semibold">Servidores</Link></li>
            <li><Link href="/guia" className="text-text-muted hover:text-primary transition-colors text-sm font-semibold">Guia do Iniciante</Link></li>
            <li><Link href="/leonida" className="text-text-muted hover:text-primary transition-colors text-sm font-semibold">Espera GTA 6</Link></li>
            <li><Link href="/planos" className="text-text-muted hover:text-primary transition-colors text-sm font-semibold">Planos</Link></li>
            <li><Link href="/sobre" className="text-text-muted hover:text-primary transition-colors text-sm font-semibold">Sobre</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-display text-white text-lg tracking-tight mb-4">Legal</h4>
          <p className="text-text-muted text-xs leading-relaxed opacity-70">
            BizerraHUB é um site de fãs, sem vínculo com a Rockstar Games. GTA V e o próximo jogo são marcas registradas da Rockstar Games e Take-Two Interactive.
          </p>
          <p className="text-text-muted text-xs mt-4">
            © {new Date().getFullYear()} BizerraHUB.
          </p>
        </div>
      </div>
    </footer>
  );
}
