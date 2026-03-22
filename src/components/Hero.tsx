import { useScrollReveal } from '@/hooks/useScrollReveal';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-primary overflow-hidden pt-14">
      {/* Subtle geometric accent */}
      <div className="absolute top-1/4 right-0 w-48 h-48 md:w-72 md:h-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-32 h-32 md:w-56 md:h-56 rounded-full bg-accent/5 blur-2xl" />

      <div ref={ref} className="container relative z-10 text-center px-6">
        <p
          className={`font-body text-accent text-sm md:text-base font-medium tracking-[0.25em] uppercase mb-6 ${
            isVisible ? 'animate-fade-up' : 'opacity-0'
          }`}
        >
          Swalih Abdullah
        </p>

        <h1
          className={`font-display text-primary-foreground text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] md:leading-[1.05] tracking-tight max-w-3xl mx-auto ${
            isVisible ? 'animate-fade-up [animation-delay:150ms]' : 'opacity-0'
          }`}
          style={{ textWrap: 'balance' } as React.CSSProperties}
        >
          Precision in Law.
          <br />
          <span className="text-accent">Creativity</span> in Design.
        </h1>

        <p
          className={`font-body text-primary-foreground/60 text-base md:text-lg mt-6 max-w-md mx-auto ${
            isVisible ? 'animate-fade-up [animation-delay:300ms]' : 'opacity-0'
          }`}
          style={{ textWrap: 'pretty' } as React.CSSProperties}
        >
          Graphic designer bridging the discipline of law with the art of visual storytelling.
        </p>

        <a
          href="#portfolio"
          className={`inline-flex items-center gap-2 mt-10 px-8 py-3.5 bg-accent text-accent-foreground font-body font-medium text-sm rounded tracking-wide uppercase ripple elevation-1 hover:elevation-2 active:scale-[0.97] transition-all duration-200 ${
            isVisible ? 'animate-fade-up [animation-delay:450ms]' : 'opacity-0'
          }`}
        >
          View Work
          <ArrowDown size={16} />
        </a>
      </div>
    </section>
  );
}
