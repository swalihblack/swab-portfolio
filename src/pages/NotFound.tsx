import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import heroPhoto from '@/assets/hero-photo.png';

const NotFound = () => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-accent relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(0_80%_50%/0.35),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,hsl(0_0%_0%/0.25),transparent_60%)]" />
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <motion.img src={heroPhoto} alt="Swalih Abdullah" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="w-40 md:w-56 mb-8 drop-shadow-2xl" />
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="font-display text-7xl md:text-9xl font-bold text-primary mb-2">
          {t('notFound.title')}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }} className="font-body text-accent-foreground/70 text-lg md:text-xl mb-8">
          {t('notFound.message')}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
          <Link to="/" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-body font-medium text-sm rounded tracking-wide uppercase ripple elevation-1 hover:elevation-2 active:scale-[0.97] transition-all duration-200">
            {t('notFound.goHome')}
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
