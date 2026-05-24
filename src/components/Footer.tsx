import { Star, Shield, Landmark } from 'lucide-react';

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-surface-container-lowest border-t-2 border-secondary-orange/50 py-16 relative">
      <div className="max-w-[1280px] mx-auto px-5 md:px-[80px] space-y-12">
        
        {/* Sponsors Coalition logo block */}
        <div className="text-center pb-12 border-b border-surface-card-high/60">
          <p className="font-mono text-[9px] text-[#848688] font-black uppercase tracking-widest mb-6">
            ORGANIZADO POR
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-12 select-none">
            
            {/* Embedded Logo replica */}
            <div className="flex items-center gap-6">
              <span className="font-headline font-black text-2xl tracking-tighter text-white">
                EVM <span className="text-secondary-orange">CHIHUAHUA</span>
              </span>
              <div className="w-[1.5px] h-8 bg-surface-variant" />
              <span className="font-headline font-black text-2xl tracking-tighter text-[#ffc080] italic">
                COMEV
              </span>
            </div>

            {/* Verification code to emphasize realistic detail */}
            <div className="bg-white/5 border border-surface-card px-3 py-1 font-mono text-[10px] text-on-surface-variant flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-orange inline-block animate-ping" />
              CÓDIGO DE TRASPASO: CO-CHIH26
            </div>

          </div>
        </div>

        {/* Footer Navigation bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Logo */}
          <div 
            onClick={handleScrollToTop}
            className="text-2xl font-headline font-black text-white hover:text-secondary-orange cursor-pointer tracking-tight"
          >
            COMEV <span className="text-secondary-orange font-bold">2026</span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 font-mono text-[11px] text-[#c4c6cf]">
            <a 
              href="https://www.facebook.com/evmchihuahua" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-secondary-orange transition-colors"
            >
              EVM Chihuahua
            </a>
            <a 
              href="https://www.facebook.com/COMEVOficial" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-secondary-orange transition-colors"
            >
              COMEV
            </a>
            <a href="#" className="hover:text-secondary-orange transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-secondary-orange transition-colors">Contact Us</a>
          </div>

          {/* Copyrights */}
          <div className="text-center md:text-end font-sans text-xs text-[#848688] max-w-xs leading-relaxed">
            © 2026 COMEV National Convention. All Rights Reserved. Hosted with pride in Chihuahua City, Mexico.
          </div>

        </div>

      </div>
    </footer>
  );
}
