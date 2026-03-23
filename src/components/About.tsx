import { useScrollReveal } from '@/hooks/useScrollReveal';

const tools = [
  { label: 'Ps', name: 'Photoshop', bg: 'bg-[hsl(200,80%,25%)]' },
  { label: 'Ai', name: 'Illustrator', bg: 'bg-[hsl(25,85%,40%)]' },
  { label: 'Id', name: 'InDesign', bg: 'bg-[hsl(340,70%,35%)]' },
  { label: 'MS', name: 'MS Suite', bg: 'bg-[hsl(200,60%,35%)]' },
  { label: 'AI', name: 'AI Tools', bg: 'bg-[hsl(260,50%,45%)]' },
];

export default function About() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="about" className="py-20 md:py-28 bg-background">
      <div ref={ref} className="container max-w-3xl">
        <h2
          className={`font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-4 ${
            isVisible ? 'animate-fade-up' : 'opacity-0'
          }`}
          style={{ textWrap: 'balance' } as React.CSSProperties}
        >
          About
        </h2>

        <div className={`w-12 h-0.5 bg-accent mx-auto mb-10 ${isVisible ? 'animate-fade-scale [animation-delay:100ms]' : 'opacity-0'}`} />

        <p
          className={`font-body text-muted-foreground text-base md:text-lg leading-relaxed text-center max-w-2xl mx-auto ${
            isVisible ? 'animate-fade-up [animation-delay:200ms]' : 'opacity-0'
          }`}
          style={{ textWrap: 'pretty' } as React.CSSProperties}
        >
          I'm Swalih Abdullah — a law student by day and a graphic designer in every other
          waking hour. I believe that the rigour of legal thinking and the freedom of creative
          expression aren't opposites — they're complementary forces. My work lives at that
          intersection: structured yet expressive, precise yet imaginative.
        </p>

        {/* Tool icons with staggered scale-in */}
        <div
          className={`flex flex-wrap items-center justify-center gap-4 mt-12 ${
            isVisible ? '' : 'opacity-0'
          }`}
        >
          {tools.map((tool, i) => (
            <div
              key={tool.label}
              className={`group flex flex-col items-center gap-2 ${
                isVisible ? 'animate-fade-scale' : 'opacity-0'
              }`}
              style={{ animationDelay: `${350 + i * 80}ms` }}
            >
              <div
                className={`${tool.bg} w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center elevation-1 group-hover:elevation-2 transition-shadow duration-200`}
              >
                <span className="text-white font-body font-bold text-sm md:text-base">
                  {tool.label}
                </span>
              </div>
              <span className="font-body text-xs text-muted-foreground">
                {tool.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
