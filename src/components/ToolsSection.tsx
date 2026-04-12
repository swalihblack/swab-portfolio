import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Palette, BookOpen, ArrowRight } from 'lucide-react';

export default function ToolsSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 0.4, 1], [60, 0, -20]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const tools = [
    {
      icon: Palette,
      title: t('tools.swabColoursTitle'),
      desc: t('tools.swabColoursDesc'),
      to: '/tools/swab-colours',
      color: 'bg-accent',
    },
    {
      icon: BookOpen,
      title: t('tools.swabLibraryTitle'),
      desc: t('tools.swabLibraryDesc'),
      to: '/tools/swab-colours/library',
      color: 'bg-primary',
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-secondary/40 overflow-hidden">
      <div className="container max-w-3xl">
        <motion.h2 style={{ y, opacity }} className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-2">
          {t('tools.sectionTitle')}
        </motion.h2>
        <motion.p style={{ y, opacity }} className="font-body text-muted-foreground text-center text-sm mb-10">
          {t('tools.sectionSubtitle')}
        </motion.p>

        <motion.div style={{ y, opacity }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="group flex items-start gap-4 p-5 rounded-lg bg-card border border-border hover:border-accent/50 hover:elevation-2 transition-all duration-200"
            >
              <div className={`${tool.color} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                <tool.icon size={22} className="text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-base font-semibold text-foreground group-hover:text-accent transition-colors">
                  {tool.title}
                </h3>
                <p className="font-body text-xs text-muted-foreground mt-1">{tool.desc}</p>
                <span className="inline-flex items-center gap-1 font-body text-xs font-medium text-accent mt-2 group-hover:gap-2 transition-all">
                  {t('tools.openTool')} <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
