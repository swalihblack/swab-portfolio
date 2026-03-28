import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Palette, BookOpen, Layout, Share2, Briefcase } from 'lucide-react';

const services = [
  { icon: Palette, name: 'Graphic Design', color: 'bg-accent' },
  { icon: BookOpen, name: 'Editorial Design', color: 'bg-primary' },
  { icon: Layout, name: 'Branding', color: 'bg-accent' },
  { icon: Share2, name: 'Social Media Design', color: 'bg-primary' },
];

/* ── Timeline data ──
   Edit this array to update your profession timeline.
   Each entry needs: year, role, org (organization), and an optional description.
*/
const timeline = [
  {
    year: '2024 – Present',
    role: 'Freelance Graphic Designer',
    org: 'Self-employed',
    description: 'Delivering branding, editorial, and social media design for diverse clients.',
  },
  {
    year: '2023 – 2024',
    role: 'Junior Designer',
    org: 'Creative Studio XYZ',
    description: 'Worked on brand identity systems and print collateral for regional brands.',
  },
  {
    year: '2022 – 2023',
    role: 'Design Intern',
    org: 'Agency ABC',
    description: 'Assisted senior designers with layout, typography, and social media campaigns.',
  },
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

        {/* Services */}
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

        {/* Timeline */}
        <motion.h3
          style={{ y: toolsY, opacity }}
          className="font-display text-xl font-bold text-foreground text-center mt-16 mb-10"
        >
          Experience
        </motion.h3>

        <motion.div style={{ y: toolsY, opacity }} className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

          <div className="space-y-10">
            {timeline.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative flex items-start gap-4 md:gap-0 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-accent border-2 border-background -translate-x-1/2 mt-1.5 z-10" />

                  {/* Content card */}
                  <div
                    className={`ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${
                      isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5 font-body text-xs font-semibold text-accent uppercase tracking-wider">
                      <Briefcase size={12} />
                      {item.year}
                    </span>
                    <h4 className="font-display text-base font-bold text-foreground mt-1">
                      {item.role}
                    </h4>
                    <p className="font-body text-sm text-muted-foreground">{item.org}</p>
                    {item.description && (
                      <p className="font-body text-xs text-muted-foreground/80 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
