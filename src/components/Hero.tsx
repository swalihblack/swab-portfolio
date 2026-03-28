import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import heroPhoto from '@/assets/hero-photo.png';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center bg-accent overflow-hidden px-6 pt-16 md:pt-0"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(0_80%_50%/0.3),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,hsl(0_0%_0%/0.2),transparent_60%)]" />

      <div className="container relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6">
        {/* Text */}
        <motion.div style={{ y, opacity, scale }}>
          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-body text-accent-foreground/70 text-sm md:text-base font-medium tracking-[0.25em] uppercase mb-6"
          >
            Swalih Abdullah
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-accent-foreground text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Precision in Law.
            <br />
            <span className="text-primary-foreground">Creativity</span> in Design.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-body text-accent-foreground/60 text-base md:text-lg mt-6 max-w-md"
            style={{ textWrap: 'pretty' } as React.CSSProperties}
          >
            Graphic designer bridging the discipline of law with the art of visual storytelling.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-3 mt-10"
          >
            <a
              href="#portfolio"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-body font-medium text-sm rounded tracking-wide uppercase ripple elevation-1 hover:elevation-2 active:scale-[0.97] transition-all duration-200"
            >
              View Work
              <ArrowDown size={16} />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent-foreground text-accent font-body font-medium text-sm rounded tracking-wide uppercase ripple elevation-1 hover:elevation-2 active:scale-[0.97] transition-all duration-200"
            >
              Contact Me
            </a>
          </motion.div>
        </motion.div>

        {/* Photo */}
        <motion.div
          style={{ y: photoY }}
          className="flex justify-center md:justify-end"
        >
          <motion.img
            src={heroPhoto}
            alt="Swalih Abdullah"
            width={800}
            height={1024}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-64 md:w-80 lg:w-96 drop-shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
