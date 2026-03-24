import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center bg-primary overflow-hidden pt-14"
    >
      {/* Parallax background accents */}
      <motion.div
        style={{ y: bgY }}
        className="absolute top-1/4 right-0 w-48 h-48 md:w-72 md:h-72 rounded-full bg-accent/10 blur-3xl"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 50]) }}
        className="absolute bottom-1/4 left-0 w-32 h-32 md:w-56 md:h-56 rounded-full bg-accent/5 blur-2xl"
      />

      <motion.div
        style={{ y, opacity, scale }}
        className="container relative z-10 text-center px-6"
      >
        <motion.p
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-body text-accent text-sm md:text-base font-medium tracking-[0.25em] uppercase mb-6"
        >
          Swalih Abdullah
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-primary-foreground text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] md:leading-[1.05] tracking-tight max-w-3xl mx-auto"
          style={{ textWrap: 'balance' } as React.CSSProperties}
        >
          Precision in Law.
          <br />
          <span className="text-accent">Creativity</span> in Design.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="font-body text-primary-foreground/60 text-base md:text-lg mt-6 max-w-md mx-auto"
          style={{ textWrap: 'pretty' } as React.CSSProperties}
        >
          Graphic designer bridging the discipline of law with the art of visual storytelling.
        </motion.p>

        <motion.a
          href="#portfolio"
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 mt-10 px-8 py-3.5 bg-accent text-accent-foreground font-body font-medium text-sm rounded tracking-wide uppercase ripple elevation-1 hover:elevation-2 active:scale-[0.97] transition-all duration-200"
        >
          View Work
          <ArrowDown size={16} />
        </motion.a>
      </motion.div>
    </section>
  );
}
