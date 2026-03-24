import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const tools = [
  { label: 'Ps', name: 'Photoshop', bg: 'bg-[hsl(200,80%,25%)]' },
  { label: 'Ai', name: 'Illustrator', bg: 'bg-[hsl(25,85%,40%)]' },
  { label: 'Id', name: 'InDesign', bg: 'bg-[hsl(340,70%,35%)]' },
  { label: 'MS', name: 'MS Suite', bg: 'bg-[hsl(200,60%,35%)]' },
  { label: 'AI', name: 'AI Tools', bg: 'bg-[hsl(260,50%,45%)]' },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 0.5, 1], [60, 0, -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const toolsY = useTransform(scrollYProgress, [0, 0.5, 1], [80, 0, -20]);

  return (
    <section ref={sectionRef} id="about" className="py-20 md:py-28 bg-background overflow-hidden">
      <div className="container max-w-3xl">
        <motion.h2
          style={{ y, opacity }}
          className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-4"
        >
          About
        </motion.h2>

        <motion.div
          style={{ opacity, scaleX: useTransform(scrollYProgress, [0, 0.3], [0, 1]) }}
          className="w-12 h-0.5 bg-accent mx-auto mb-10 origin-center"
        />

        <motion.p
          style={{ y, opacity }}
          className="font-body text-muted-foreground text-base md:text-lg leading-relaxed text-center max-w-2xl mx-auto"
        >
          I'm Swalih Abdullah — a law student by day and a graphic designer in every other
          waking hour. I believe that the rigour of legal thinking and the freedom of creative
          expression aren't opposites — they're complementary forces. My work lives at that
          intersection: structured yet expressive, precise yet imaginative.
        </motion.p>

        <motion.div
          style={{ y: toolsY, opacity }}
          className="flex flex-wrap items-center justify-center gap-4 mt-12"
        >
          {tools.map((tool, i) => (
            <motion.div
              key={tool.label}
              style={{
                y: useTransform(scrollYProgress, [0, 0.4 + i * 0.05, 1], [40 + i * 10, 0, -10]),
              }}
              className="group flex flex-col items-center gap-2"
            >
              <div
                className={`${tool.bg} w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center elevation-1 group-hover:elevation-2 transition-shadow duration-200`}
              >
                <span className="text-white font-body font-bold text-sm md:text-base">
                  {tool.label}
                </span>
              </div>
              <span className="font-body text-xs text-muted-foreground">{tool.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
