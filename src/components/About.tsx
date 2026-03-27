import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Palette, BookOpen, Layout, Share2 } from 'lucide-react';

const services = [
  { icon: Palette, name: 'Graphic Design', color: 'bg-accent' },
  { icon: BookOpen, name: 'Editorial Design', color: 'bg-primary' },
  { icon: Layout, name: 'Branding', color: 'bg-accent' },
  { icon: Share2, name: 'Social Media Design', color: 'bg-primary' },
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

        <motion.h3
          style={{ y: toolsY, opacity }}
          className="font-display text-xl font-bold text-foreground text-center mt-14 mb-8"
        >
          Services
        </motion.h3>

        <motion.div
          style={{ y: toolsY, opacity }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {services.map((service, i) => (
            <motion.div
              key={service.name}
              style={{
                y: useTransform(scrollYProgress, [0, 0.4 + i * 0.05, 1], [40 + i * 10, 0, -10]),
              }}
              className="group flex flex-col items-center gap-3 p-4 rounded-lg bg-card elevation-1 hover:elevation-2 transition-shadow duration-200"
            >
              <div className={`${service.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <service.icon size={22} className="text-primary-foreground" />
              </div>
              <span className="font-body text-xs text-center font-medium text-foreground">{service.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
